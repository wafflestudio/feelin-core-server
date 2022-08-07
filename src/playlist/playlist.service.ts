import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePlaylistDto } from './dto/create-playlist.dto.js';
import { getConnection, Repository } from 'typeorm';
import { Playlist, StreamPlaylist } from './playlist.entity.js';
import { StreamAccount, User } from '@user/user.entity.js';
import { TrackService } from '@track/track.service.js';
import { PlaylistScraperService } from '@playlist-scraper/playlist-scraper.service.js';
import { SavePlaylistDto } from '@user/dto/save-playlist.dto.js';
import { asymmDecrypt, symmDecrypt } from '@utils/cipher.js';
import { AuthdataService } from '@authdata/authdata.service.js';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepository: Repository<Playlist>,
        @InjectRepository(StreamPlaylist)
        private streamPlaylistRepository: Repository<StreamPlaylist>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(StreamAccount)
        private streamAccountRepository: Repository<StreamAccount>,
        private readonly trackService: TrackService,
        private readonly playlistScraperService: PlaylistScraperService,
        private readonly authdataService: AuthdataService,
    ) {}

    async getMatchedTracks(playlist: Playlist) {
        await Promise.all(
            playlist.tracks.map(async (track) => {
                const matchingStreamTracks =
                    await this.trackService.getMatchingTracks(track);
                matchingStreamTracks.map((streamTrack) => {
                    streamTrack.track = track;
                });
            }),
        );
        return;
    }

    async createPlaylist(
        createPlaylistDto: CreatePlaylistDto,
    ): Promise<Playlist> {
        const { playlistUrl } = createPlaylistDto;
        const { streamType, playlistId } =
            await this.playlistScraperService.getStreamAndId(playlistUrl);

        const streamPlaylist = await this.streamPlaylistRepository.findOne({
            where: { streamId: playlistId, streamType: streamType },
            relations: ['playlist'],
        });
        // If playlist is already saved in database
        if (streamPlaylist) {
            return streamPlaylist.playlist;
        }

        // Get playlist info from streaming service
        let playlist = await this.playlistScraperService
            .get(streamType)
            .getPlaylist(playlistId);
        // Match tracks with other streaming services
        await this.getMatchedTracks(playlist).catch((error) => {
            console.error(error);
        });

        // Save the playlist
        // TODO: Do some checks when saving playlist
        playlist = await this.playlistRepository.save(playlist);
        for (const track of playlist.tracks) {
            getConnection();
        }

        return playlist;
    }

    async savePlaylist(
        userId: number,
        playlistId: number,
        savePlaylistDto: SavePlaylistDto,
    ) {
        const user = await this.userRepository.findOne({ id: userId });
        if (user === undefined) {
            throw new NotFoundException('Not Found', 'user not found');
        }

        const playlist = await this.playlistRepository.findOne({
            id: playlistId,
        });
        if (playlist === undefined) {
            throw new NotFoundException('Not Found', 'playlist not found');
        }

        const { symmKey, publicKey } = savePlaylistDto;
        const account = await this.streamAccountRepository.findOne({
            where: {
                user: user,
                publicKey: publicKey,
            },
        });

        if (account === undefined) {
            throw new NotFoundException(
                'Not Found',
                'available streaming service account not found',
            );
        }

        const key = await asymmDecrypt(symmKey, account.privateKey);
        const cookie = await symmDecrypt(account.cookie, key);

        const response = await this.playlistScraperService
            .get(account.streamType)
            .savePlaylist(
                playlist,
                this.authdataService.fromString(account.streamType, cookie),
            );
        return response;
    }
}

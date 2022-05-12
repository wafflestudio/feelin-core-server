import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackService } from 'src/track/track.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { SavePlaylistDto } from 'src/user/dto/save-playlist.dto';
import { User } from 'src/user/user.entity';
import { asymmDecrypt, symmDecrypt } from 'src/utils/cipher';
import { getConnection, Repository } from 'typeorm';
import PlaylistManagers, { getStreamAndId } from './functions';
import { Playlist, StreamPlaylist } from './playlist.entity';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepository: Repository<Playlist>,
        @InjectRepository(StreamPlaylist)
        private streamPlaylistRepository: Repository<StreamPlaylist>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly trackService: TrackService,
    ) {}

    async getMatchedTracks(playlist: Playlist) {
        await Promise.all(
            playlist.tracks.map(async (track) => {
                const matchingStreamTracks =
                    await this.trackService.getMatchingTracks(track);
                track.streamTracks = [
                    ...track.streamTracks,
                    ...matchingStreamTracks,
                ];
            }),
        );
        return;
    }

    async createPlaylist(
        createPlaylistDto: CreatePlaylistDto,
    ): Promise<Playlist> {
        const { playlistUrl } = createPlaylistDto;
        const { streamType, playlistId } = await getStreamAndId(playlistUrl);

        const streamPlaylist = await this.streamPlaylistRepository.findOne({
            where: { streamId: playlistId, streamType: streamType },
            relations: ['playlist'],
        });
        // If playlist is already saved in database
        if (streamPlaylist) {
            return streamPlaylist.playlist;
        }

        // Get playlist info from streaming service
        let playlist = await PlaylistManagers[streamType].getPlaylist(
            playlistId,
        );
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
        if (user.streamAccounts === undefined) {
            throw new NotFoundException(
                'Not Found',
                'available streaming service account not found',
            );
        }
        const account = user.streamAccounts.find(
            (account) => account.publicKey === publicKey,
        );
        if (account === undefined) {
            throw new NotFoundException(
                'Not Found',
                'streaming service account mathcing the key not found',
            );
        }

        const key = await asymmDecrypt(symmKey, account.privateKey);
        const cookie = await symmDecrypt(account.cookie, key);

        const response = await PlaylistManagers[
            account.streamType
        ].savePlaylist(playlist, cookie);
        return response;
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackService } from 'src/track/track.service';
import { createPlaylistDto } from 'src/user/dto/create-playlist.dto';
import { savePlaylistDto } from 'src/user/dto/save-playlist.dto';
import { User } from 'src/user/user.entity';
import { asymmDecrypt, symmDecrypt } from 'src/utils/cipher';
import { Repository } from 'typeorm';
import playlistFunction from './functions';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepository: Repository<Playlist>,
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
        return playlist;
    }

    // TODO: Combine with getPlaylist & track matching algorithm
    async createPlaylist(userId: number, createDto: createPlaylistDto) {}

    async savePlaylist(
        userId: number,
        playlistId: number,
        saveDto: savePlaylistDto,
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

        const { symmKey, publicKey } = saveDto;
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

        const response = await playlistFunction[
            account.streamType
        ].savePlaylist(playlist, cookie);
        return response;
    }
}

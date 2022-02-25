import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPlaylistDto } from 'src/user/dto/create-playlist.dto';
import { savePlaylistDto } from 'src/user/dto/save-playlist.dto';
import { User } from 'src/user/user.entity';
import { asymmDecrypt, symmDecrypt } from 'src/utils/cipher';
import { Repository } from 'typeorm';
import { melonPlaylist } from './functions';
import { Playlist } from './playlist.entity';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRepository: Repository<Playlist>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    // TODO: Combine with getPlaylist & track matching algorithm
    async createPlaylist(userId: number, createDto: createPlaylistDto) {}

    async savePlaylist(
        userId: number,
        playlistId: number,
        saveDto: savePlaylistDto,
    ) {
        const user = await this.userRepository.findOne({ id: userId });
        if (user === undefined) {
            console.error(`no user with id ${userId} found`);
            return;
        }

        const playlist = await this.playlistRepository.findOne({
            id: playlistId,
        });
        if (playlist === undefined) {
            console.error(`no playlist with id ${playlistId} found`);
            return;
        }

        const { symmKey, publicKey } = saveDto;
        const account = user.streamAccounts.find(
            (account) => account.publicKey === publicKey,
        );
        if (account === undefined) {
            console.error(`streaming account not found`);
            return;
        }

        const decSymmKey = await asymmDecrypt(symmKey, account.privateKey);
        const cookie = await symmDecrypt(account.cookie, decSymmKey);

        const response = await melonPlaylist.savePlaylist(playlist, cookie);
        return response;
    }
}

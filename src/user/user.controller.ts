import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaylistService } from 'src/playlist/playlist.service';
import { createPlaylistDto } from './dto/create-playlist.dto';
import { loginStreamDto } from './dto/login-stream.dto';
import { savePlaylistDto } from './dto/save-playlist.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User API')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly playlistService: PlaylistService,
    ) {}

    @Post(':userId/playlists/:playlistId')
    @HttpCode(201)
    @ApiOperation({
        summary: 'Playlist save API',
        description: `Saves a playlist to user's streaming service account`,
    })
    async savePlaylist(
        @Param('userId') userId: number,
        @Param('playlistId') playlistId: number,
        @Body() saveDto: savePlaylistDto,
    ) {
        await this.playlistService.savePlaylist(userId, playlistId, saveDto);
    }

    @Post(':userId/playlists')
    @HttpCode(201)
    @ApiOperation({
        summary: 'Playlist create API',
        description: `Creates a playlist to the database from a streaming service's playlist url`,
    })
    async createPlaylist(
        @Param('userId') userId: number,
        @Body() createDto: createPlaylistDto,
    ) {}

    @Post(':userId/stream/login')
    @HttpCode(200)
    async loginStreamAccont(
        @Param('userId') userId: number,
        @Body() loginDto: loginStreamDto,
    ) {
        const key = await this.userService.loginStreamAccount(userId, loginDto);
        return key;
    }
}

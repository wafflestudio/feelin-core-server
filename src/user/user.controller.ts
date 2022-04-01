import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlaylistService } from 'src/playlist/playlist.service';
import { LoginStreamDto } from './dto/login-stream.dto';
import { SavePlaylistDto } from './dto/save-playlist.dto';
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
        @Body() savePlaylistDto: SavePlaylistDto,
    ) {
        await this.playlistService.savePlaylist(
            userId,
            playlistId,
            savePlaylistDto,
        );
    }

    @Post(':userId/stream/login')
    @HttpCode(200)
    async loginStreamAccont(
        @Param('userId') userId: number,
        @Body() loginStreamDto: LoginStreamDto,
    ) {
        const key = await this.userService.loginStreamAccount(
            userId,
            loginStreamDto,
        );
        return key;
    }
}

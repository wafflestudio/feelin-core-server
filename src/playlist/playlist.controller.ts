import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePlaylistDto } from './dto/create-playlist.dto.js';
import { PlaylistService } from './playlist.service.js';

@Controller('playlists')
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}

    @Post('/')
    @HttpCode(201)
    @ApiOperation({
        summary: 'Playlist create API',
        description: `Creates a playlist to the database from a streaming service's playlist url`,
    })
    async createPlaylist(@Body() createPlaylistDto: CreatePlaylistDto) {
        await this.playlistService.createPlaylist(createPlaylistDto);
    }
}

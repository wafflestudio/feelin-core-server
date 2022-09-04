import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePlaylistRequestDto } from './dto/create-playlist-request.dto.js';
import { PlaylistDto } from './dto/playlist.dto.js';
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
    async createPlaylist(@Body() createPlaylistDto: CreatePlaylistRequestDto): Promise<PlaylistDto> {
        return this.playlistService.createPlaylist(createPlaylistDto);
    }

    @Get('/:playlistId')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Playlist get API',
        description: `Gets a playlist with the given id`,
    })
    async getPlaylist(@Param('playlistId') playlistId: string): Promise<PlaylistDto> {
        return this.playlistService.getPlaylist(playlistId);
    }
}

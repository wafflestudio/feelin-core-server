import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { UserAuthentication } from '@/user/user-authentication.decorator.js';
import { DecryptedVendorAccountDto } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { VendorAuthGuard } from '@/vendor-account/vendor-auth.guard.js';
import { VendorAuthentication } from '@/vendor-account/vendor-authentication.decorator.js';
import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CreatePlaylistRequestDto } from './dto/create-playlist-request.dto.js';
import { PlaylistDto } from './dto/playlist.dto.js';
import { PlaylistService } from './playlist.service.js';

@Controller('playlists')
export class PlaylistController {
    constructor(private readonly playlistService: PlaylistService) {}

    @ApiOperation({ summary: 'Playlist create API', description: `Creates a playlist from a streaming service's playlist url` })
    @ApiCreatedResponse({ type: PlaylistDto })
    @Post('/')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async createPlaylist(
        @Body() createPlaylistDto: CreatePlaylistRequestDto,
        @UserAuthentication() user: User,
    ): Promise<PlaylistDto> {
        return this.playlistService.createPlaylist(createPlaylistDto, user);
    }

    @ApiOperation({ summary: 'Playlist get API', description: `Gets a playlist with the given id` })
    @ApiOkResponse({ type: PlaylistDto })
    @Get('/:playlistId')
    @HttpCode(200)
    async getPlaylist(@Param('playlistId') playlistId: string): Promise<PlaylistDto> {
        return this.playlistService.getPlaylist(playlistId);
    }

    @ApiOperation({ summary: 'Playlist save API', description: `Saves a playlist to user's streaming service account` })
    @ApiCreatedResponse()
    @UseGuards(JwtAuthGuard, VendorAuthGuard)
    @Post(':playlistId/save')
    @HttpCode(201)
    async savePlaylist(
        @VendorAuthentication() vendorAccount: DecryptedVendorAccountDto,
        @Param('playlistId') playlistId: string,
        @Body() savePlaylistDto: SavePlaylistRequestDto,
    ) {
        await this.playlistService.savePlaylistToAccount(vendorAccount, playlistId, savePlaylistDto);
    }
}

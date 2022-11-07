import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { PlaylistService } from '@/playlist/playlist.service.js';
import { DecryptedVendorAccountDto } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { VendorAuthGuard } from '@/vendor-account/vendor-auth.guard.js';
import { VendorAuthentication } from '@/vendor-account/vendor-authentication.decorator.js';
import { Body, Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginStreamRequestDto } from './dto/login-stream.dto.js';
import { SavePlaylistRequestDto } from './dto/save-playlist-request.dto.js';
import { SignUpDto } from './dto/signup.dto.js';
import { UserDto } from './dto/user.dto.js';
import { User } from './entity/user.entity.js';
import { UserAuthentication } from './user-authentication.decorator.js';
import { UserService } from './user.service.js';

@Controller('users')
@ApiTags('User API')
export class UserController {
    constructor(private readonly userService: UserService, private readonly playlistService: PlaylistService) {}

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: 'User signup API',
        description: 'Creates a new user',
    })
    async signup(@Body() signUpDto: SignUpDto) {
        const user = await this.userService.signup(signUpDto);
        return new UserDto(user.id, user.username);
    }

    @UseGuards(JwtAuthGuard)
    @Post('stream/account')
    @HttpCode(201)
    async linkStreamAccount(@UserAuthentication() user: User, @Body() loginStreamDto: LoginStreamRequestDto) {
        const key = await this.userService.linkStreamAccount(user, loginStreamDto);
        return key;
    }

    @UseGuards(JwtAuthGuard)
    @Delete('stream/account/:accountId')
    @HttpCode(204)
    async unlinkStreamAccount(@UserAuthentication() user: User, @Param('accountId') accountId: string) {
        await this.userService.unlinkStreamAccount(user, accountId);
    }

    @UseGuards(JwtAuthGuard, VendorAuthGuard)
    @Post('playlists/:playlistId')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Playlist save API',
        description: `Saves a playlist to user's streaming service account`,
    })
    async savePlaylist(
        @VendorAuthentication() vendorAccount: DecryptedVendorAccountDto,
        @Param('playlistId') playlistId: string,
        @Body() savePlaylistDto: SavePlaylistRequestDto,
    ) {
        await this.playlistService.savePlaylistToAccount(vendorAccount, playlistId, savePlaylistDto);
    }
}

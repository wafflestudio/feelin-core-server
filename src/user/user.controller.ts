import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { PlaylistService } from '@/playlist/playlist.service.js';
import { Body, Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginStreamRequestDto } from './dto/login-stream.dto.js';
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
}

import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { Body, Controller, Delete, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { SignUpDto } from './dto/signup.dto.js';
import { UserDto } from './dto/user.dto.js';
import { UserAuthentication } from './user-authentication.decorator.js';
import { UserService } from './user.service.js';

@Controller('users')
@ApiTags('User API')
export class UserController {
    constructor(private readonly userService: UserService) {}

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
    @Delete('stream/account/:accountId')
    @HttpCode(204)
    async unlinkStreamAccount(@UserAuthentication() user: User, @Param('accountId') accountId: string) {
        await this.userService.unlinkStreamAccount(user, accountId);
    }
}

import { JwtAuthGuard } from '@/auth/jwt-auth.guard.js';
import { Body, Controller, Delete, HttpCode, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { SignUpDto } from './dto/signup.dto.js';
import { UserDto } from './dto/user.dto.js';
import { UserAuthentication } from './user-authentication.decorator.js';
import { UserService } from './user.service.js';

@Controller('users')
@ApiTags('User API')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'User signup API', description: 'Creates a new user' })
    @ApiCreatedResponse()
    @Post()
    @HttpCode(201)
    async signup(@Body() signUpDto: SignUpDto) {
        const user = await this.userService.signup(signUpDto);
        return new UserDto(user.id, user.username);
    }

    @ApiOperation({ summary: 'User delete API', description: 'Deletes a user' })
    @ApiNoContentResponse()
    @UseGuards(JwtAuthGuard)
    @Delete('/:userId')
    @HttpCode(204)
    async delete(@UserAuthentication() user: User, @Param('userId') userId: string) {
        if (user.id !== userId) {
            throw new UnauthorizedException('user can only delete its own account');
        }
        await this.userService.delete(user.id);
    }
}

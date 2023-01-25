import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/signup.dto.js';
import { UserDto } from './dto/user.dto.js';
import { UserService } from './user.service.js';

@Controller('users')
@ApiTags('User API')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(201)
    @ApiOperation({ summary: 'User signup API', description: 'Creates a new user' })
    @ApiCreatedResponse()
    async signup(@Body() signUpDto: SignUpDto) {
        const user = await this.userService.signup(signUpDto);
        return new UserDto(user.id, user.username);
    }
}

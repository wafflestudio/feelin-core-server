import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader.startsWith('Bearer ')) {
            return false;
        }

        const userToken = authHeader.split(' ')[1];

        const user = await this.authService.validateUserToken(userToken);
        request.user = user;

        return true;
    }
}

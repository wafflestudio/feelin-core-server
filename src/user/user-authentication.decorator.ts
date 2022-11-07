import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './entity/user.entity.js';

export const UserAuthentication = createParamDecorator((data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});

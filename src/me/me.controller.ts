import { Controller, Get } from '@nestjs/common';

@Controller('me')
export class MeController {
    @Get('recent/tracks')
    async getRecentTracks() {}
}

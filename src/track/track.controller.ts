import { Controller, Get, Query } from '@nestjs/common';

@Controller('track')
export class TrackController {
    // TODO
    @Get('search')
    searchTrack(@Query('q') query: string) {}
}

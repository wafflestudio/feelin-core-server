import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackScraperModule } from '@track-scraper/track-scraper.module.js';
import StreamTrack from './streamTrack.entity.js';
import { TrackController } from './track.controller.js';
import { TrackService } from './track.service.js';

@Module({
    imports: [TrackScraperModule, TypeOrmModule.forFeature([StreamTrack])],
    controllers: [TrackController],
    providers: [TrackService],
    exports: [TrackService, TypeOrmModule],
})
export class TrackModule {}

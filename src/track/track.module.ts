import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackScraperModule } from '@/track-scraper/track-scraper.module.js';
import { TrackController } from './track.controller.js';
import { TrackService } from './track.service.js';
import { VendorTrack } from '@/track/entity/vendor-track.entity.js';

@Module({
    imports: [TrackScraperModule, TypeOrmModule.forFeature([VendorTrack])],
    controllers: [TrackController],
    providers: [TrackService],
    exports: [TrackService],
})
export class TrackModule {}

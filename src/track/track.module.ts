import { PrismaService } from '@/prisma.service.js';
import { TrackScraperModule } from '@/track-scraper/track-scraper.module.js';
import { Module } from '@nestjs/common';
import { TrackController } from './track.controller.js';
import { TrackRepository } from './track.repository.js';
import { TrackService } from './track.service.js';
import { VendorTrackRepository } from './vendor-track.repository.js';

@Module({
    imports: [TrackScraperModule],
    controllers: [TrackController],
    providers: [TrackService, PrismaService, PrismaService, TrackRepository, VendorTrackRepository],
    exports: [TrackService, TrackRepository, VendorTrackRepository],
})
export class TrackModule {}

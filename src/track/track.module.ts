import { Module } from '@nestjs/common';
import { TrackScraperModule } from 'src/track-scraper/track-scraper.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
    imports: [TrackScraperModule],
    controllers: [TrackController],
    providers: [TrackService],
    exports: [TrackService],
})
export class TrackModule {}

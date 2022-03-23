import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
    controllers: [TrackController],
    providers: [TrackService],
    exports: [TrackService],
})
export class TrackModule {}

import { SimilarityUtilService } from '@/utils/similarity-util/similarity-util.service.js';
import { TrackMatcherService } from './track-matcher.service.js';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [TrackMatcherService, SimilarityUtilService],
    exports: [TrackMatcherService],
})
export class TrackMatcherModule {}

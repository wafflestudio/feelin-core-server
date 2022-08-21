import { TrackScraperService } from '@/track-scraper/track-scraper.service.js';
import { fromTrackEntity, toStreamTrackEntity } from '@feelin-types/helpers.js';
import { StreamServiceEnum, TrackInfo } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreamTrack } from './streamTrack.entity.js';
import { Track } from './track.entity.js';

@Injectable()
export class TrackService {
    constructor(
        private readonly trackScraperService: TrackScraperService,
        @InjectRepository(StreamTrack)
        private readonly streamTrackRepository: Repository<StreamTrack>,
    ) {}

    async getMatchingTracks(track: Track): Promise<StreamTrack[]> {
        const streamTracks = await this.findStreamTracks(track);
        const reference = fromTrackEntity(track);

        const searchPromise: Promise<TrackInfo[]>[] = [];
        for (const streamType of StreamServiceEnum) {
            if (streamType === streamTracks[0].streamType) {
                continue;
            }
            searchPromise.push(this.trackScraperService.get(streamType).searchTrack(reference));
        }
        const searchResults = await Promise.all(searchPromise);

        const matchPromise: Promise<TrackInfo>[] = [];
        for (const searchResult of searchResults) {
            const match = this.trackScraperService.matchTracks(searchResult, reference);
            matchPromise.push(match);
        }
        const matches = await Promise.all(matchPromise);

        return matches.map(toStreamTrackEntity);
    }

    async findStreamTracks(track: Track): Promise<StreamTrack[]> {
        return this.streamTrackRepository.find({
            where: { track: track },
        });
    }

    async findAllStreamTracks(tracks: Track[]): Promise<StreamTrack[]> {
        return this.streamTrackRepository.find({
            relations: ['track'],
            where: tracks.map((track) => {
                return { track: track };
            }),
        });
    }
}

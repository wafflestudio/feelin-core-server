import { VendorTrack } from '@/track/entity/vendorTrack.entity.js';
import { TrackScraperService } from '@/track-scraper/track-scraper.service.js';
import { toStreamTrackEntity } from '@feelin-types/helpers.js';
import { VendorEnum, ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entity/track.entity.js';

@Injectable()
export class TrackService {
    constructor(
        private readonly trackScraperService: TrackScraperService,
        @InjectRepository(VendorTrack)
        private readonly streamTrackRepository: Repository<VendorTrack>,
    ) {}

    async getMatchingTracks(track: Track): Promise<VendorTrack[]> {
        const streamTracks = await this.findStreamTracks(track);
        const reference = {} as ITrack;

        const searchPromise: Promise<ITrack[]>[] = [];
        for (const vendor of VendorEnum) {
            if (vendor === streamTracks[0].vendor) {
                continue;
            }
            searchPromise.push(this.trackScraperService.get(vendor).searchTrack(reference));
        }
        const searchResults = await Promise.all(searchPromise);

        const matchPromise: Promise<ITrack>[] = [];
        for (const searchResult of searchResults) {
            const match = this.trackScraperService.matchTracks(searchResult, reference);
            matchPromise.push(match);
        }
        const matches = await Promise.all(matchPromise);

        return matches.map(toStreamTrackEntity);
    }

    async findStreamTracks(track: Track): Promise<VendorTrack[]> {
        return this.streamTrackRepository.find({
            where: {
                track: {
                    id: track.id,
                },
            },
        });
    }

    async findAllStreamTracks(tracks: Track[]): Promise<VendorTrack[]> {
        return this.streamTrackRepository.find({
            relations: ['track'],
            where: tracks.map((track) => ({
                track: {
                    id: track.id,
                },
            })),
        });
    }
}

import { AlbumDto } from '@/album/dto/album.dto.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { TrackSearchResultDto } from '@/playlist/dto/track-search-result.dto.js';
import { TrackScraperService } from '@/track-scraper/track-scraper.service.js';
import { VendorTrack } from '@/track/entity/vendor-track.entity.js';
import { toStreamTrackEntity } from '@feelin-types/helpers.js';
import { ITrack, VendorEnum } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackDto } from './dto/track.dto.js';
import { Track } from './entity/track.entity.js';

@Injectable()
export class TrackService {
    constructor(
        private readonly trackScraperService: TrackScraperService,
        @InjectRepository(VendorTrack)
        private readonly vendorTrackRepository: Repository<VendorTrack>,
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
        return this.vendorTrackRepository.find({
            where: { track: { id: track.id } },
        });
    }

    async findAllStreamTracks(tracks: Track[]): Promise<VendorTrack[]> {
        return this.vendorTrackRepository.find({
            relations: ['track'],
            where: tracks.map((track) => ({ track: { id: track.id } })),
        });
    }

    getMatchedVendorTrack(candidates: TrackSearchResultDto[], reference: ITrack): string | null {
        return candidates[0].vendorId;
    }

    toTrackDto(track: Track): TrackDto {
        return new TrackDto(
            track.id,
            track.title,
            track.artists.map((artist) => new ArtistDto(artist.id, artist.name)),
            new AlbumDto(track.album.id, track.album.title, track.album.coverUrl),
        );
    }
}

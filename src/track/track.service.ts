import { AlbumDto } from '@/album/dto/album.dto.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { TrackSearchResultDto } from '@/playlist/dto/track-search-result.dto.js';
import { TrackScraperService } from '@/track-scraper/track-scraper.service.js';
import { ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { TrackDto } from './dto/track.dto.js';
import { TrackWithArtistAndAlbum } from './track.repository.js';
import { VendorTrackRepository } from './vendor-track.repository.js';

@Injectable()
export class TrackService {
    constructor(
        private readonly trackScraperService: TrackScraperService,
        private readonly vendorTrackRepository: VendorTrackRepository,
    ) {}

    getMatchedVendorTrack(candidates: TrackSearchResultDto[], reference: ITrack): string | null {
        return candidates[0].vendorId;
    }

    toTrackDto(track: TrackWithArtistAndAlbum): TrackDto {
        return new TrackDto(
            track.id,
            track.title,
            track.artists.map(({ artist }) => new ArtistDto(artist.id, artist.name)),
            new AlbumDto(track.album.id, track.album.title, track.album.coverUrl),
        );
    }
}

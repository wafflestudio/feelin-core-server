import { AlbumDto } from '@/album/dto/album.dto.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { TrackScraperService } from '@/track-scraper/track-scraper.service.js';
import { TrackInfo } from '@/types/types.js';
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

    toTrackDto(track: TrackWithArtistAndAlbum): TrackDto {
        return new TrackDto(
            track.id,
            track.title,
            track.artists.map(({ artist }) => new ArtistDto(artist.id, artist.name)),
            new AlbumDto(track.album.id, track.album.title, track.album.coverUrl),
        );
    }

    toTrackInfo(track: TrackWithArtistAndAlbum): TrackInfo {
        return {
            title: track.title,
            id: null,
            duration: track.duration,
            artists: track.artists.map(({ artist }) => ({ name: artist.name, id: null })),
            artistNames: track.artists.map(({ artist }) => artist.name).join(', '),
            album: { title: track.album.title, id: null, coverUrl: track.album.coverUrl },
            albumTitle: track.album.title,
        };
    }
}

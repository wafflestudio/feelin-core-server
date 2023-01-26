import { AlbumDto } from '@/album/dto/album.dto.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { TrackInfo, Vendors } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise, VendorTrack } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { TrackDto } from './dto/track.dto.js';
import { TrackOnPlaylistRepository } from './track-on-playlist.repository.js';
import { TrackWithArtistAndAlbum, TrackWithArtistAndAlbumAndVendorTrack } from './track.repository.js';
import { VendorTrackRepository, VendorTrackWithTrack } from './vendor-track.repository.js';

@Injectable()
export class TrackService {
    constructor(
        private readonly vendorTrackRepository: VendorTrackRepository,
        private readonly trackOnPlaylistRepository: TrackOnPlaylistRepository,
    ) {}

    mergeOrCreateTrack(
        track: TrackWithArtistAndAlbumAndVendorTrack,
        existingVendorTrack: VendorTrackWithTrack,
        matchedVendorTrack: TrackInfo,
        vendor: Vendors,
    ): PrismaPromise<VendorTrack | Prisma.BatchPayload>[] {
        if (existingVendorTrack) {
            return [
                this.vendorTrackRepository.update({ track: { connect: { id: track.id } } }, { id: existingVendorTrack.id }),
                this.trackOnPlaylistRepository.updateMany({ trackId: track.id }, { trackId: existingVendorTrack.trackId }),
            ];
        }

        return [
            this.vendorTrackRepository.create({
                id: uuidv4(),
                vendor: vendor,
                vendorId: matchedVendorTrack.id,
                track: {
                    connect: { id: track.id },
                },
            }),
        ];
    }

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

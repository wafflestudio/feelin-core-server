import { AlbumDto } from '@/album/dto/album.dto.js';
import { ArtistDto } from '@/artist/dto/artist.dto.js';
import { TrackInfo, Vendors } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import { PrismaPromise, VendorTrack } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { TrackDto } from './dto/track.dto.js';
import { TrackWithArtistAndAlbum, TrackWithArtistAndAlbumAndVendorTrack } from './track.repository.js';
import { VendorTrackRepository, VendorTrackWithTrack } from './vendor-track.repository.js';

@Injectable()
export class TrackService {
    constructor(private readonly vendorTrackRepository: VendorTrackRepository) {}

    mergeOrCreateTrack(
        track: TrackWithArtistAndAlbumAndVendorTrack,
        matchedVendorTrack: TrackInfo,
        vendor: Vendors,
        existingVendorTrack: VendorTrackWithTrack,
    ): PrismaPromise<VendorTrack> {
        // TODO: Need to merge artists and album too
        if (existingVendorTrack) {
            return this.vendorTrackRepository.update({ track: { connect: { id: track.id } } }, { id: existingVendorTrack.id });
        }

        return this.vendorTrackRepository.create({
            id: uuidv4(),
            vendor: vendor,
            vendorId: matchedVendorTrack.id,
            track: {
                connect: { id: track.id },
            },
        });
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

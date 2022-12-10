import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Album, Artist, ArtistOnTrack, Prisma, PrismaPromise, Track } from '@prisma/client';
import { ulid } from 'ulid';

@Injectable()
export class TrackRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.TrackCreateInput, tx?: Prisma.TransactionClient): PrismaPromise<Track> {
        const client = !!tx ? tx : this.prismaService;
        return client.track.create({ data });
    }

    update(
        data: Prisma.TrackUpdateInput,
        where: Prisma.TrackWhereUniqueInput,
        tx?: Prisma.TransactionClient,
    ): PrismaPromise<Track> {
        const client = !!tx ? tx : this.prismaService;
        return client.track.update({ data, where });
    }

    async connectPlaylist(input: {
        playlistId: string;
        trackId: string;
        trackSequence: number;
        tx?: Prisma.TransactionClient;
    }): Promise<Track> {
        const { playlistId, trackId, trackSequence, tx } = input;
        const client = !!tx ? tx : this.prismaService;

        const track = await client.track.update({
            where: { id: trackId },
            data: {
                playlists: {
                    create: {
                        id: ulid(),
                        playlist: { connect: { id: playlistId } },
                        trackSequence,
                    },
                },
            },
        });

        return track;
    }

    async createWithArtistAndAlbumAndPlaylistAndVendorTrack(input: {
        data: Omit<Prisma.TrackCreateInput, 'artists' | 'album' | 'playlists' | 'vendorTracks'>;
        artists: { artistId: string; artistSequence: number }[];
        albumId: string;
        playlistId: string;
        trackSequence: number;
        vendorTrack: { vendor: string; id: string };
        tx?: Prisma.TransactionClient;
    }): Promise<Track> {
        const { data, artists, albumId, playlistId, trackSequence, vendorTrack, tx } = input;
        const client = !!tx ? tx : this.prismaService;
        const { vendor, id } = vendorTrack;

        const track = await client.track.create({
            data: {
                ...data,
                artists: {
                    create: artists.map(({ artistId, artistSequence }) => ({
                        id: ulid(),
                        artist: { connect: { id: artistId } },
                        artistSequence,
                    })),
                },
                album: { connect: { id: albumId } },
                playlists: {
                    create: {
                        id: ulid(),
                        playlist: { connect: { id: playlistId } },
                        trackSequence,
                    },
                },
                vendorTracks: {
                    connectOrCreate: {
                        where: { vendorId_vendor: { vendorId: id, vendor } },
                        create: {
                            id: ulid(),
                            vendor,
                            vendorId: id,
                        },
                    },
                },
            },
        });

        return track;
    }

    async findAllWithArtistAndAlbumByPlaylistId(playlistId: string): Promise<TrackWithArtistAndAlbum[]> {
        const trackOnPlaylists = await this.prismaService.trackOnPlaylist.findMany({
            where: { playlistId },
            include: {
                track: {
                    include: {
                        artists: {
                            include: { artist: true },
                            orderBy: { artistSequence: 'asc' },
                        },
                        album: true,
                    },
                },
            },
            orderBy: { trackSequence: 'asc' },
        });

        return trackOnPlaylists.map(({ track }) => track);
    }
}

export type TrackWithArtistAndAlbum = Track & {
    artists: (ArtistOnTrack & { artist: Artist })[];
    album: Album;
};

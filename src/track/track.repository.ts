import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import { Album, Artist, ArtistOnTrack, Prisma, PrismaPromise, Track } from '@prisma/client';

@Injectable()
export class TrackRepository {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: Prisma.TrackCreateInput): PrismaPromise<Track> {
        return this.prismaService.track.create({ data });
    }

    async findAllWithArtistAndAlbumByPlaylistId(playlistId: string): Promise<TrackWithArtistAndAlbum[]> {
        const tracks = await this.prismaService.track.findMany({
            where: {
                playlists: {
                    some: { playlistId },
                },
            },
            include: {
                artists: { include: { artist: true } },
                album: true,
            },
        });
        return tracks;
    }
}

export type TrackWithArtistAndAlbum = Track & {
    artists: (ArtistOnTrack & { artist: Artist })[];
    album: Album;
};

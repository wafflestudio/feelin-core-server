import { PrismaService } from '@/prisma.service.js';
import { Injectable } from '@nestjs/common';
import _ from 'lodash-es';
import { Album, Artist, ArtistOnTrack, Prisma, PrismaPromise, Track, TrackOnPlaylist } from '@prisma/client';

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

    async findAllWithArtistAndAlbumByPlaylistId(playlistId: string): Promise<TrackWithArtistAndAlbum[]> {
        const trackOnPlaylists = await this.prismaService.trackOnPlaylist.findMany({
            where: { playlistId },
            include: {
                track: {
                    include: {
                        artists: { include: { artist: true } },
                        album: true,
                    },
                },
            },
            orderBy: {
                trackSequence: 'asc',
            },
        });
        // FIXME: Prisma doesn't support nested orderBy yet
        return trackOnPlaylists.map(({ track }) => track);
    }
}

export type TrackWithArtistAndAlbum = Track & {
    artists: (ArtistOnTrack & { artist: Artist })[];
    album: Album;
};

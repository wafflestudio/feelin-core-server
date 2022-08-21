import { Album } from '@/album/album.entity.js';
import { StreamAlbum } from '@/album/streamAlbum.entity.js';
import { Artist } from '@/artist/artist.entity.js';
import { StreamArtist } from '@/artist/streamArtist.entity.js';
import { Playlist } from '@/playlist/playlist.entity.js';
import { StreamPlaylist } from '@/playlist/streamPlaylist.entity.js';
import { StreamTrack } from '@/track/streamTrack.entity.js';
import { Track } from '@/track/track.entity.js';
import { User } from '@/user/user.entity.js';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';

export const mockRepository = () => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
});

export type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

export function MockRepositoryModule(entities: EntityClassOrSchema[]) {
    return entities.map((entity) => {
        return {
            provide: getRepositoryToken(entity),
            useValue: mockRepository(),
        };
    });
}

export const TypeOrmSQLITETestingModule = (entities: EntityClassOrSchema[]) => [
    TypeOrmModule.forRootAsync({
        useFactory: () => ({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: [Album, StreamAlbum, Artist, StreamArtist, Playlist, StreamPlaylist, Track, StreamTrack, User],
            synchronize: true,
            autoLoadEntities: true,
        }),
    }),
    TypeOrmModule.forFeature(entities),
];

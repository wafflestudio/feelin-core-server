import { Album } from '@/album/entity/album.entity.js';
import { VendorAlbum } from '@/album/entity/vendorAlbum.entity.js';
import { Artist } from '@/artist/entity/artist.entity.js';
import { Track } from '@/track/entity/track.entity.js';
import { User } from '@/user/entity/user.entity.js';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';
import { VendorArtist } from '@/artist/entity/vendorArtist.entity.js';
import { VendorTrack } from '@/track/entity/vendorTrack.entity.js';
import { Playlist } from '@/playlist/entity/playlist.entity.js';
import { VendorPlaylist } from '@/playlist/entity/vendorPlaylist.entity.js';

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
            entities: [Album, VendorAlbum, Artist, VendorArtist, Playlist, VendorPlaylist, Track, VendorTrack, User],
            synchronize: true,
            autoLoadEntities: true,
        }),
    }),
    TypeOrmModule.forFeature(entities),
];

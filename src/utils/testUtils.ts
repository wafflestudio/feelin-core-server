import { Album } from '@/album/entity/album.entity.js';
import { VendorAlbum } from '@/album/entity/vendorAlbum.entity.js';
import { Artist } from '@/artist/entity/artist.entity.js';
import { VendorArtist } from '@/artist/entity/vendorArtist.entity.js';
import { Playlist } from '@/playlist/entity/playlist.entity.js';
import { VendorPlaylist } from '@/playlist/entity/vendorPlaylist.entity.js';
import { Track } from '@/track/entity/track.entity.js';
import { VendorTrack } from '@/track/entity/vendorTrack.entity.js';
import { User } from '@/user/entity/user.entity.js';
import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DataType, newDb } from 'pg-mem';
import { DataSource, Repository } from 'typeorm';
import { getEnvFile } from './getEnvFile';

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

export async function createTestingModule(
    metadata: ModuleMetadata & { entities?: EntityClassOrSchema[] },
): Promise<TestingModule> {
    const db = newDb();

    db.public.registerFunction({
        name: 'current_database',
        args: [],
        returns: DataType.text,
        implementation: (x) => `hello world ${x}`,
    });

    const dataSource = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [User, Album, Artist, Track, VendorAlbum, VendorArtist, VendorTrack, Playlist, VendorPlaylist],
        synchronize: true,
    });

    const imports = metadata.imports || [];
    const providers = metadata.providers || [];

    const module: TestingModule = await Test.createTestingModule({
        imports: [
            ...imports,
            TypeOrmModule.forRoot(),
            TypeOrmModule.forFeature(metadata.entities),
            ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [getEnvFile()],
            }),
        ],
        controllers: metadata.controllers,
        providers: [...providers],
        exports: metadata.exports,
    })
        .overrideProvider(DataSource)
        .useValue(dataSource)
        .compile();

    return module;
}

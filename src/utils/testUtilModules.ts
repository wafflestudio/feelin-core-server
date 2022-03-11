import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';

const mockRepository = () => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const testRepositoryModule = (entities: EntityClassOrSchema[]) =>
    entities.map((entity) => {
        return {
            provide: getRepositoryToken(entity),
            useValue: mockRepository(),
        };
    });

export { testRepositoryModule, MockRepository };

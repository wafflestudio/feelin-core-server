import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Repository } from 'typeorm';

const mockRepository = () => ({
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    softDelete: jest.fn(),
});

export type MockRepository<T = any> = Partial<
    Record<keyof Repository<T>, jest.Mock>
>;

export function testRepositoryModule(entities: EntityClassOrSchema[]) {
    return entities.map((entity) => {
        return {
            provide: getRepositoryToken(entity),
            useValue: mockRepository(),
        };
    });
}

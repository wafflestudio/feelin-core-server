import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getEnvFile } from './get-env-file';

export async function createTestingModule(metadata: ModuleMetadata): Promise<TestingModule> {
    const imports = metadata.imports || [];
    const providers = metadata.providers || [];

    const module: TestingModule = await Test.createTestingModule({
        imports: [
            ...imports,
            ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [getEnvFile()],
            }),
        ],
        controllers: metadata.controllers,
        providers: [...providers],
        exports: metadata.exports,
    }).compile();

    return module;
}

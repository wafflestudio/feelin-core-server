import { createTestingModule } from '@/utils/test-utils.js';
import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module.js';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await createTestingModule({
            imports: [AppModule],
        });

        app = moduleFixture.createNestApplication();
        await app.init();
    });
});

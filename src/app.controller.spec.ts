import { TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { createTestingModule } from './utils/test-utils.js';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        });

        appController = app.get<AppController>(AppController);
    });

    it('should be defined', () => {
        expect(appController).toBeDefined();
    });
});

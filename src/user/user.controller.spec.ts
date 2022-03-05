import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistModule } from 'src/playlist/playlist.module';
import testUtilModule from 'src/utils/testUtilModules';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...testUtilModule(), UserModule, PlaylistModule],
            providers: [UserService],
            controllers: [UserController],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

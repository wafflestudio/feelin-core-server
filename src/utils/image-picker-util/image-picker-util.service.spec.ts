import { Test, TestingModule } from '@nestjs/testing';
import { ImagePickerUtilService } from './image-picker-util.service';

describe('ImagePickerUtilService', () => {
  let service: ImagePickerUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagePickerUtilService],
    }).compile();

    service = module.get<ImagePickerUtilService>(ImagePickerUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

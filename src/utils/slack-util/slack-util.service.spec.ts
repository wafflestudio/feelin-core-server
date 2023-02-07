import { Test, TestingModule } from '@nestjs/testing';
import { SlackUtilService } from './slack-util.service';

describe('SlackUtilService', () => {
  let service: SlackUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackUtilService],
    }).compile();

    service = module.get<SlackUtilService>(SlackUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

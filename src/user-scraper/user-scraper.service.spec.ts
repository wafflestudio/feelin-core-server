import { Test, TestingModule } from '@nestjs/testing';
import { UserScraperService } from './user-scraper.service';

describe('UserScraperService', () => {
  let service: UserScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserScraperService],
    }).compile();

    service = module.get<UserScraperService>(UserScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ArtistScraperService } from './artist-scraper.service';

describe('ArtistScraperService', () => {
  let service: ArtistScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistScraperService],
    }).compile();

    service = module.get<ArtistScraperService>(ArtistScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

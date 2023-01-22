import { Test, TestingModule } from '@nestjs/testing';
import { CookieUtilService } from './cookie-util.service';

describe('CookieUtilService', () => {
  let service: CookieUtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookieUtilService],
    }).compile();

    service = module.get<CookieUtilService>(CookieUtilService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

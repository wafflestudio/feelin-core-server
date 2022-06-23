import { Module } from '@nestjs/common';
import { UserScraperService } from './user-scraper.service';

@Module({
    providers: [UserScraperService],
    exports: [UserScraperService],
})
export class UserScraperModule {}

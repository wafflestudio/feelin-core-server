import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';

@Module({
    controllers: [ArtistController],
})
export class ArtistModule {}

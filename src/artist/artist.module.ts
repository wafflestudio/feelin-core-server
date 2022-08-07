import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller.js';

@Module({
    controllers: [ArtistController],
})
export class ArtistModule {}

import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller.js';

@Module({
    controllers: [AlbumController],
})
export class AlbumModule {}

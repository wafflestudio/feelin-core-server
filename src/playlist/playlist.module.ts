import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PlaylistController } from './playlist.controller';
import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlist.service';

@Module({
    imports: [
        forwardRef(() => UserModule),
        TypeOrmModule.forFeature([Playlist]),
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService, TypeOrmModule],
})
export class PlaylistModule {}

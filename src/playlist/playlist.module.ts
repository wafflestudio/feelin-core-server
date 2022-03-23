import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackModule } from 'src/track/track.module';
import { UserModule } from 'src/user/user.module';
import { PlaylistController } from './playlist.controller';
import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlist.service';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => TrackModule),
        TypeOrmModule.forFeature([Playlist]),
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService],
    exports: [PlaylistService, TypeOrmModule],
})
export class PlaylistModule {}

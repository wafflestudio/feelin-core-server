import { CustomRepository } from '@/dao/custom-repository.decorator.js';
import { Repository } from 'typeorm';
import { PlaylistTrack } from './entity/playlist-track.entity.js';

@CustomRepository(PlaylistTrack)
export class PlaylistTrackRepository extends Repository<PlaylistTrack> {
    findAllWithTrackWithAlbumById(playlistId: string): Promise<PlaylistTrack[]> {
        return this.manager
            .createQueryBuilder(PlaylistTrack, 'p_t')
            .where('p_t.playlist = :playlistId', { playlistId: playlistId })
            .leftJoinAndSelect('p_t.track', 't')
            .leftJoinAndSelect('t.album', 'a')
            .getMany();
    }
}

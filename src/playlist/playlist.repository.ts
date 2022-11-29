import { CustomRepository } from '@/dao/custom-repository.decorator.js';
import { Repository } from 'typeorm';
import { Playlist } from './entity/playlist.entity';

@CustomRepository(Playlist)
export class PlaylistRepository extends Repository<Playlist> {
    async findWithTracksById(id: string): Promise<Playlist | undefined> {
        return this.findOneOrFail({ where: { id }, relations: { tracks: true } });
    }
}

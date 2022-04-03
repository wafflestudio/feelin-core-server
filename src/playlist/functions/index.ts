import { StreamService } from 'src/types';
import { FloPlaylistManager } from './flo';
import getStreamAndId from './getStreamAndId';
import { MelonPlaylistManager } from './melon';
import PlaylistManager from './PlaylistManager';

const PlaylistManagers: { [key in StreamService]: PlaylistManager } = {
    flo: new FloPlaylistManager(),
    melon: new MelonPlaylistManager(),
};

export default PlaylistManagers;
export { getStreamAndId };

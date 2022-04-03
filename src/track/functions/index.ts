import { StreamService } from 'src/types';
import FloTrackManager from './flo';
import matchTracks from './matchTracks';
import { MelonTrackManager } from './melon';
import TrackManager from './TrackManager';

const TrackManagers: { [key in StreamService]: TrackManager } = {
    melon: new MelonTrackManager(),
    flo: new FloTrackManager(),
};

export default TrackManagers;
export { matchTracks };

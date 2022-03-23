import { StreamService } from 'src/types';
import FloTrackManager from './flo';
import matchTrack from './matchTrack';
import { MelonTrackManager } from './melon';
import TrackManager from './TrackManager';

const trackManagers: { [key in StreamService]: TrackManager } = {
    melon: new MelonTrackManager(),
    flo: new FloTrackManager(),
};

export { trackManagers, matchTrack };

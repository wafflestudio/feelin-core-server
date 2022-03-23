import { TrackInfo } from 'src/types';
import { StreamTrack } from '../track.entity';

/**
 *
 * Simple matching algorithm, compares title, artists, album and return true if all are same
 * @param candidates Search results to find match in
 * @param reference The reference
 * @returns Matching TrackInfo
 */

async function matchTrack(
    candidates: TrackInfo[],
    reference: TrackInfo,
): Promise<StreamTrack | null> {
    const match = candidates.filter((track) => {
        return track.isEqual(reference);
    });

    if (match.length === 0) {
        return null;
    }
    return StreamTrack.fromTrackInfo(match[0]);
}

export default matchTrack;

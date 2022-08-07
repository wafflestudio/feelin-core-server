import axios from 'axios';
import { TrackInfo } from '@feelin-types/types.js';
import FloTrackScraper from '.';

const searchUrl = 'https://www.music-flo.com/api/search/v2/search';

async function searchTrack(
    this: FloTrackScraper,
    track: TrackInfo,
): Promise<TrackInfo[]> {
    // Flo search API limits max 250 results at once
    const response = await axios.get(searchUrl, {
        params: {
            keyword: track.title,
            searchType: 'TRACK',
            sortType: 'ACCURACY',
            size: 100,
            page: 1,
        },
    });

    const trackList: TrackInfo[] = response.data?.data?.list[0]?.list?.map(
        (track) => {
            const { id, name, artistList, album } = track;
            const artists = artistList.map((artist) => artist.name);
            return {
                streamType: 'flo',
                title: name,
                streamId: id,
                artists: artists,
                album: album.title,
            };
        },
    );
    return trackList;
}

export default searchTrack;

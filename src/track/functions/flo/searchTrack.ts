import axios from 'axios';
import { TrackInfo } from 'src/types';

const searchUrl = 'https://www.music-flo.com/api/search/v2/search';

async function searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
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

    const trackList = response.data?.data?.list[0]?.list?.map((track) => {
        const { id, name, artistList, album } = track;
        const artists = artistList.map((artist) => artist.name);
        return new TrackInfo(name, artists, album.title, 'flo', id);
    });
    return trackList;
}

export default searchTrack;

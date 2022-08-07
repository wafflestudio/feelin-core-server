import axios from 'axios';
import { FloAuthdata } from '@authdata/types';
import FloTrackScraper from '.';

const recentTrackUrl =
    'https://www.music-flo.com/api/personal/v1/tracks/recentlistened';

async function getMyRecentTracks(
    this: FloTrackScraper,
    floAuthdata: FloAuthdata,
) {
    const res = await axios.get(recentTrackUrl, {
        headers: {
            Cookie: this.authdataService.toString('flo', floAuthdata),
            'x-gm-access-token': floAuthdata.accessToken,
        },
    });
    console.log(res);
}

export default getMyRecentTracks;

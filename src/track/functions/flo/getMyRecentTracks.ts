import axios from 'axios';
import { JwtTokenPair } from 'src/types';

const recentTrackUrl =
    'https://www.music-flo.com/api/personal/v1/tracks/recentlistened';

async function getMyRecentTracks(tokenPair: JwtTokenPair) {
    const res = await axios.get(recentTrackUrl, {
        headers: {
            Cookie: tokenPair.toString('flo'),
            'x-gm-access-token': tokenPair.accessToken,
        },
    });
    console.log(res);
}

export default getMyRecentTracks;

import axios from 'axios';
import { TrackInfo, CookieData } from '../../types';

const createPlaylistUrl =
    'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insertAction.json';

async function createPlaylist(
    title: string,
    description: string,
    tracks: Array<TrackInfo>,
    cookie: CookieData,
) {
    const params = {
        plylstTitle: title,
        playlistDesc: description,
        openYn: 'Y',
        repntImagePath: '',
        repntImagePathDefaultYn: 'N',
    };
    let data = new URLSearchParams(params);
    tracks.map((track) => {
        data.append('songIds[]', track.id);
    });

    const response = await axios.post(createPlaylistUrl, data, {
        headers: {
            Cookie: cookie.toString(),
            Connection: 'keep-alive',
            Referer:
                'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insert.htm',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
    return response.data.result;
}

export default createPlaylist;

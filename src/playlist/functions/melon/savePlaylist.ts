import axios from 'axios';
import { Playlist } from 'src/playlist/playlist.entity';
import { CookieData } from 'src/types';

const createPlaylistUrl =
    'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insertAction.json';

async function savePlaylist(playlist: Playlist, cookieData: CookieData) {
    const { title, description, tracks } = playlist;

    const params = {
        plylstTitle: title,
        playlistDesc: description,
        openYn: 'Y',
        repntImagePath: '',
        repntImagePathDefaultYn: 'N',
    };
    const data = new URLSearchParams(params);
    tracks.map((track) => {
        const melonId = track.streamTracks.find(
            (streamTrack) => streamTrack?.streamType === 'melon',
        )?.streamId;
        // Filter out un-found tracks
        if (melonId) {
            data.append('songIds[]', melonId);
        }
    });

    const response = await axios.post(createPlaylistUrl, data, {
        headers: {
            Cookie: cookieData.toString('melon'),
            Referer:
                'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insert.htm',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
    return response.data.result;
}

export default savePlaylist;

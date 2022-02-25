import axios from 'axios';
import { Playlist } from 'src/playlist/playlist.entity';

const createPlaylistUrl =
    'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insertAction.json';

async function saveMelonPlaylist(playlist: Playlist, cookie: string) {
    const { title, description, tracks } = playlist;

    const params = {
        plylstTitle: title,
        playlistDesc: description,
        openYn: 'Y',
        repntImagePath: '',
        repntImagePathDefaultYn: 'N',
    };
    let data = new URLSearchParams(params);
    tracks.map((track) => {
        data.append('songIds[]', track.melonId);
    });

    const response = await axios.post(createPlaylistUrl, data, {
        headers: {
            Cookie: cookie,
            Connection: 'keep-alive',
            Referer:
                'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insert.htm',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
    return response.data.result;
}

export default saveMelonPlaylist;

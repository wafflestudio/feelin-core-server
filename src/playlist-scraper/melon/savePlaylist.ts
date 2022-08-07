import { Playlist } from '@playlist/playlist.entity.js';
import axios from 'axios';
import { MelonAuthdata } from '@authdata/types';
import MelonPlaylistScraper from '.';

const createPlaylistUrl =
    'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insertAction.json';

async function savePlaylist(
    this: MelonPlaylistScraper,
    playlist: Playlist,
    melonAuthData: MelonAuthdata,
) {
    const { title, tracks } = playlist;

    const params = {
        plylstTitle: title,
        // FIXME: description should come from post
        playlistDesc: '',
        openYn: 'Y',
        repntImagePath: '',
        repntImagePathDefaultYn: 'N',
    };
    const data = new URLSearchParams(params);
    const streamTracks = await this.trackService.findAllStreamTracks(
        playlist.tracks,
    );
    tracks.map((track) => {
        const melonId = streamTracks.find(
            (streamTrack) =>
                streamTrack.track === track &&
                streamTrack?.streamType === 'melon',
        )?.streamId;
        if (melonId) {
            data.append('songIds[]', melonId);
        }
    });

    const response = await axios.post(createPlaylistUrl, data, {
        headers: {
            Cookie: melonAuthData.toString(),
            Referer:
                'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insert.htm',
            'X-Requested-With': 'XMLHttpRequest',
        },
    });
    return response.data.result;
}

export default savePlaylist;

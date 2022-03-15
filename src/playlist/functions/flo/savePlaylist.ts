import axios from 'axios';
import { Playlist } from 'src/playlist/playlist.entity';
import { JwtTokenPair } from 'src/types';

const createPlaylistUrl =
    'https://www.music-flo.com/api/personal/v1/myplaylist';

async function savePlaylist(playlist: Playlist, tokenPair: JwtTokenPair) {
    const createResponse = await axios.post(
        createPlaylistUrl,
        {
            memberChannelName: playlist.title,
        },
        {
            headers: {
                Cookie: tokenPair.toCookieString('flo'),
                'x-gm-access-token': tokenPair.accessToken,
            },
        },
    );
    if (createResponse.data?.code !== '2000000') {
        return null;
    }

    const playlistId = createResponse.data?.data?.id;
    const trackIds = playlist.tracks.map(
        (track) =>
            track.streamTracks.find(
                (streamTrack) => streamTrack.streamType === 'flo',
            ).streamId,
    );
    const addResponse = await axios.post(
        createPlaylistUrl + `/${playlistId}/tracks`,
        {
            trackIdList: trackIds,
        },
        {
            headers: {
                Cookie: tokenPair.toCookieString('flo'),
                'x-gm-access-token': tokenPair.accessToken,
            },
        },
    );
    if (addResponse.data?.code !== '2000000') {
        return null;
    }
}

export default savePlaylist;

import axios from 'axios';
import { FloAuthdata } from '@authdata/types';
import { Playlist } from '@playlist/playlist.entity.js';
import { FloPlaylistScraper } from '.';

const createPlaylistUrl =
    'https://www.music-flo.com/api/personal/v1/myplaylist';

async function savePlaylist(
    this: FloPlaylistScraper,
    playlist: Playlist,
    floAuthData: FloAuthdata,
) {
    const createResponse = await axios.post(
        createPlaylistUrl,
        {
            memberChannelName: playlist.title,
        },
        {
            headers: {
                Cookie: this.authdataService.toString('flo', floAuthData),
                'x-gm-access-token': floAuthData.accessToken,
            },
        },
    );
    if (createResponse.data?.code !== '2000000') {
        return null;
    }

    const playlistId = createResponse.data?.data?.id;
    const streamTracks = await this.trackService.findAllStreamTracks(
        playlist.tracks,
    );
    const trackIds = playlist.tracks
        .map(
            (track) =>
                streamTracks.find(
                    (streamTrack) =>
                        streamTrack.track === track &&
                        streamTrack.streamType === 'flo',
                )?.streamId,
        )
        .filter((id) => id !== null); // Filter out un-found tracks

    const addResponse = await axios.post(
        createPlaylistUrl + `/${playlistId}/tracks`,
        {
            trackIdList: trackIds,
        },
        {
            headers: {
                Cookie: this.authdataService.toString('flo', floAuthData),
                'x-gm-access-token': floAuthData.accessToken,
            },
        },
    );
    if (addResponse.data?.code !== '2000000') {
        return null;
    }
}

export default savePlaylist;

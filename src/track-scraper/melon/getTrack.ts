import { Album, StreamAlbum } from '@album/album.entity.js';
import { Artist, StreamArtist } from '@artist/artist.entity.js';
import StreamTrack from '@track/streamTrack.entity.js';
import Track from '@track/track.entity.js';
import { convDate } from '@utils/floUtils.js';
import axios from 'axios';
import MelonTrackScraper from '.';

const trackInfoUrl = 'https://m2.melon.com/m6/v2/song/info.json';

async function getTrack(
    this: MelonTrackScraper,
    trackId: string,
): Promise<Track> {
    const res = await axios
        .get(trackInfoUrl, {
            params: {
                songId: trackId,
            },
        })
        .catch((error) => {
            // FIXME: Better error message
            if (error.response) {
                throw new Error('error while making request');
            } else if (error.request) {
                throw new Error('error while making request');
            } else {
                throw new Error('error while making request');
            }
        });

    const trackData = res.data?.response?.SONGINFO;
    const streamTrack = new StreamTrack();
    streamTrack.streamId = trackData?.SONGID;
    streamTrack.streamType = 'melon';

    // Track
    const track = new Track();
    track.title = trackData?.SONGNAME;

    const albumData = res.data?.response?.ALBUMINFO;
    const streamAlbum = new StreamAlbum();
    streamAlbum.streamId = albumData?.ALBUMID;
    streamAlbum.streamType = 'melon';

    // Album
    const album = new Album();
    album.title = albumData?.ALBUMNAME;
    album.realeaseDate = convDate(albumData?.ISSUEDATE);

    const streamAlbumArtist = new StreamArtist();
    streamAlbumArtist.streamId = albumData?.ARTISTLIST[0]?.ARTISTID;
    streamAlbumArtist.streamType = 'melon';

    const albumArtist = new Artist();
    albumArtist.name = albumData?.ARTISTLIST[0]?.ARTISTNAME;
    album.artist = albumArtist;

    // Artists
    const artists = trackData?.ARTISTLIST?.map((artistData) => {
        const streamArtist = new StreamArtist();
        streamArtist.streamId = artistData?.ARTISTID;
        streamArtist.streamType = 'melon';

        const artist = new Artist();
        artist.name = artistData?.ARTISTNAME;
        return artist;
    });

    track.artists = artists;
    track.album = album;

    return track;
}

export default getTrack;

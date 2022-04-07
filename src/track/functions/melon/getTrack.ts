import axios from 'axios';
import { Album, StreamAlbum } from 'src/album/album.entity';
import { Artist, StreamArtist } from 'src/artist/artist.entity';
import { StreamTrack, Track } from 'src/track/track.entity';
import { convDate } from 'src/utils/floUtils';

const trackInfoUrl = 'https://m2.melon.com/m6/v2/song/info.json';

async function getTrack(trackId: string): Promise<Track> {
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
    track.streamTracks = [streamTrack];

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
    albumArtist.streamArtists = [streamAlbumArtist];
    album.artist = albumArtist;

    // Artists
    const artists = trackData?.ARTISTLIST?.map((artistData) => {
        const streamArtist = new StreamArtist();
        streamArtist.streamId = artistData?.ARTISTID;
        streamArtist.streamType = 'melon';

        const artist = new Artist();
        artist.name = artistData?.ARTISTNAME;
        artist.streamArtists = [streamArtist];
        return artist;
    });

    track.artists = artists;
    track.album = album;

    return track;
}

export default getTrack;

import axios from 'axios';
import { Album, StreamAlbum } from 'src/album/album.entity';
import { Artist, StreamArtist } from 'src/artist/artist.entity';
import { Playlist, StreamPlaylist } from 'src/playlist/playlist.entity';
import { StreamTrack, Track } from 'src/track/track.entity';
import { convDate } from 'src/utils/floUtils';

const playlistInforUrl = {
    user: 'https://m2.melon.com/m6/v1/mymusic/playlist/inform.json',
    dj: 'https://m2.melon.com/m6/v1/dj/playlist/inform.json',
};
const playlistTracksUrl = {
    user: 'https://m2.melon.com/m6/v1/mymusic/playlist/listSong.json',
    dj: 'https://m2.melon.com/m6/v1/dj/playlist/listSong.json',
};

async function getPlaylist(playlistId: string): Promise<Playlist> {
    const [type, id] = playlistId.split(':');
    if (type != 'user' && type != 'dj') {
        // FIXME: Better error message
        throw new Error('Not supported playlist type');
    }

    const infoRes = await axios.get(playlistInforUrl[type], {
        params: {
            plylstSeq: id,
            cpId: '.',
            cpKey: '.',
        },
    });

    const streamPlaylist = new StreamPlaylist();
    streamPlaylist.streamId = playlistId;
    streamPlaylist.streamType = 'melon';

    const playlist = new Playlist();
    if (type == 'dj') {
        playlist.title = infoRes.data?.response?.DJPLAYLIST?.PLYLSTTITLE;
    } else if (type == 'user') {
        playlist.title = infoRes.data?.response?.PLYLSTTITLE;
    }
    playlist.streamPlaylists = [streamPlaylist];

    const trackRes = await axios
        .get(playlistTracksUrl[type], {
            params: {
                plylstSeq: id,
                startIndex: 1,
                pageSize: 1000,
                cpId: '.',
                cpKey: '.',
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

    const tracks = trackRes.data?.response?.SONGLIST?.map((trackData) => {
        // Track entity
        const streamTrack = new StreamTrack();
        streamTrack.streamType = 'melon';
        streamTrack.streamId = trackData?.SONGID;

        const track = new Track();
        track.title = trackData?.SONGNAME;
        track.streamTracks = [streamTrack];

        // Album entity
        const streamAlbum = new StreamAlbum();
        streamAlbum.streamId = trackData?.ALBUMID;
        streamAlbum.streamType = 'melon';

        const album = new Album();
        album.title = trackData?.ALBUMNAME;
        album.realeaseDate = convDate(trackData?.ISSUEDATE);
        album.streamAlbums = [streamAlbum];

        // Artists entity
        const artistsData = trackData?.ARTISTLIST;
        const artists = artistsData?.map((artistData) => {
            const streamArtist = new StreamArtist();
            streamArtist.streamId = artistData?.ARTISTID;
            streamArtist.streamType = 'melon';

            const artist = new Artist();
            artist.name = artistData?.ARTISTNAME;
            artist.albums = [album];
            artist.streamArtists = [streamArtist];
            return artist;
        });

        track.album = album;
        track.artists = artists;
        return track;
    });
    playlist.tracks = tracks;

    return playlist;
}

export default getPlaylist;

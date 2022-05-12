import axios from 'axios';
import { Album, StreamAlbum } from 'src/album/album.entity';
import { Artist, StreamArtist } from 'src/artist/artist.entity';
import { Playlist, StreamPlaylist } from 'src/playlist/playlist.entity';
import { StreamTrack, Track } from 'src/track/track.entity';
import { convDate } from 'src/utils/floUtils';

const playlistUrl = {
    user: 'https://api.music-flo.com/personal/v1/playlist/',
    dj: 'https://api.music-flo.com/meta/v1/channel/',
};

async function getPlaylist(playlistId: string): Promise<Playlist> {
    const [type, id] = playlistId.split(':');
    if (type != 'user' && type != 'dj') {
        // FIXME: Better error message
        throw new Error('Not supported playlist type');
    }
    const res = await axios.get(playlistUrl[type] + id).catch((error) => {
        // FIXME: Better error message
        if (error.response) {
            throw new Error('error while making request');
        } else if (error.request) {
            throw new Error('error while making request');
        } else {
            throw new Error('error while making request');
        }
    });

    const playlistData = res.data?.data;
    const floPlaylist = new StreamPlaylist();
    floPlaylist.streamType = 'flo';
    floPlaylist.streamId = playlistId;

    const playlist = new Playlist();
    playlist.title = playlistData?.name;
    playlist.streamPlaylists = [floPlaylist];

    let trackList;
    if (type == 'user') {
        trackList = playlistData?.track?.list;
    } else if (type == 'dj') {
        trackList = playlistData?.trackList;
    }

    const tracks = trackList?.map((trackData) => {
        // Track entity
        const streamTrack = new StreamTrack();
        streamTrack.streamType = 'flo';
        streamTrack.streamId = trackData?.id;

        const track = new Track();
        track.title = trackData?.name;
        track.streamTracks = [streamTrack];

        // Album entity
        const albumData = trackData?.album;
        const streamAlbum = new StreamAlbum();
        streamAlbum.streamId = albumData?.id;
        streamAlbum.streamType = 'flo';

        const album = new Album();
        album.title = albumData?.title;
        album.realeaseDate = convDate(albumData?.releaseYmd);
        album.streamAlbums = [streamAlbum];

        // Artists entity
        const artistsData = trackData?.artistList;
        const artists = artistsData?.map((artistData) => {
            const streamArtist = new StreamArtist();
            streamArtist.streamId = artistData?.id;
            streamArtist.streamType = 'flo';

            const artist = new Artist();
            artist.name = artistData?.name;
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

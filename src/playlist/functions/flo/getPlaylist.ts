import axios from 'axios';
import { Album, StreamAlbum } from 'src/album/album.entity';
import { Artist, StreamArtist } from 'src/artist/artist.entity';
import { Playlist, StreamPlaylist } from 'src/playlist/playlist.entity';
import { StreamTrack, Track } from 'src/track/track.entity';
import { convDate } from './utils';

const playlistUrl = 'https://www.music-flo.com/api/meta/v1/channel/';

async function getPlaylist(playlistId: string): Promise<Playlist> {
    const res = await axios.get(playlistUrl + playlistId);
    const playlistData = res.data?.data;

    let floPlaylist = new StreamPlaylist();
    floPlaylist.streamType = 'flo';
    floPlaylist.streamId = playlistData?.id;

    let playlist = new Playlist();
    playlist.title = playlistData?.name;
    playlist.streamPlaylists = [floPlaylist];

    let tracks = playlistData?.trackList?.map((trackData) => {
        // Track entity
        let streamTrack = new StreamTrack();
        streamTrack.streamType = 'flo';
        streamTrack.streamId = trackData?.id;

        let track = new Track();
        track.title = trackData?.name;
        track.streamTracks = [streamTrack];

        // Album entity
        const albumData = trackData?.album;
        let streamAlbum = new StreamAlbum();
        streamAlbum.streamId = albumData?.id;
        streamAlbum.streamType = 'flo';

        let album = new Album();
        album.title = albumData?.title;
        album.realeaseDate = convDate(albumData?.releaseYmd);
        album.streamAlbums = [streamAlbum];

        // Artists entity
        const artistsData = trackData?.artistList;
        const artists = artistsData?.map((artistData) => {
            let streamArtist = new StreamArtist();
            streamArtist.streamId = artistData?.id;
            streamArtist.streamType = 'flo';

            let artist = new Artist();
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

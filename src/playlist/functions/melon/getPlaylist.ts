import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { Album, StreamAlbum } from 'src/album/album.entity';
import { Artist, StreamArtist } from 'src/artist/artist.entity';
import { Playlist, StreamPlaylist } from 'src/playlist/playlist.entity';
import { MelonTrackUtils } from 'src/track/functions/melon';
import { StreamTrack, Track } from 'src/track/track.entity';
import getFirstPlaylistTracks from './getFirstPlaylistTracks';

const playlistPagingUrl = {
    dj: 'https://www.melon.com/dj/playlist/djplaylist_listsong.htm?',
    norm: '',
};
const pageSize = 50;

async function getPlaylist(playlistId: string): Promise<Playlist> {
    const [type, id] = playlistId.split(':');
    if (type != 'my' && type != 'dj') {
        // FIXME: Better error message
        throw new Error('Not supported playlist type');
    }

    const { title, count, trackData } = await getFirstPlaylistTracks(type, id);

    const requestArr: Promise<AxiosResponse<any, any>>[] = [];
    for (let i = 1; i < Math.ceil(count / pageSize); i++) {
        requestArr.push(
            axios.get(playlistPagingUrl[type], {
                params: {
                    startIndex: i * pageSize + 1,
                    pageSize: pageSize,
                },
                headers: {
                    Referer: `${playlistPagingUrl}?plylstSeq=${id}`,
                },
            }),
        );
    }

    await axios.all(requestArr).then((responses) => {
        for (const response of responses) {
            const $ = cheerio.load(response.data);
            $('table > tbody > tr').each((_, el) => {
                if (type === 'my') {
                    trackData.push(MelonTrackUtils.scrapeMyMusicTrack($, el));
                } else if (type === 'dj') {
                    trackData.push(MelonTrackUtils.scrapeTrack($, el));
                }
            });
        }
    });

    const melonPlaylist = new StreamPlaylist();
    melonPlaylist.streamType = 'melon';
    melonPlaylist.streamId = playlistId;

    const playlist = new Playlist();
    playlist.title = title;

    const tracks = trackData.map((data) => {
        // Track entity
        const streamTrack = new StreamTrack();
        streamTrack.streamType = 'melon';
        streamTrack.streamId = data?.trackId;

        const track = new Track();
        track.title = data?.title;
        track.streamTracks = [streamTrack];

        // Album entity
        const streamAlbum = new StreamAlbum();
        streamAlbum.streamId = data?.albumId;
        streamAlbum.streamType = 'melon';

        const album = new Album();
        album.title = data?.album;
        // TODO: Get date when parse from melon
        // album.realeaseDate = new Date();
        album.streamAlbums = [streamAlbum];

        // Artists entity
        const artists: Artist[] = [];
        for (let i = 0; i < data?.artists?.length; i++) {
            const streamArtist = new StreamArtist();
            streamArtist.streamId = data?.artistIds[i];
            streamArtist.streamType = 'melon';

            const artist = new Artist();
            artist.name = data?.artists[i];
            artist.albums = [album];
            artist.streamArtists = [streamArtist];
            artists.push(artist);
        }

        track.album = album;
        track.artists = artists;
        return track;
    });

    playlist.tracks = tracks;
    return playlist;
}

export default getPlaylist;

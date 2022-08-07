import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { Album, StreamAlbum } from '@album/album.entity.js';
import { Artist, StreamArtist } from '@artist/artist.entity.js';
import { Playlist, StreamPlaylist } from '@playlist/playlist.entity.js';
import MelonPlaylistScraper from '.';
import StreamTrack from '@track/streamTrack.entity.js';
import Track from '@track/track.entity.js';

const playlistUrl = {
    dj: 'https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm',
    norm: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm',
};
const playlistPagingUrl = {
    dj: 'https://www.melon.com/dj/playlist/djplaylist_listsong.htm?',
    norm: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_listPagingSong.htm',
};
const pageSize = 50;

async function getPlaylist(
    this: MelonPlaylistScraper,
    playlistId: string,
): Promise<Playlist> {
    const [type, id] = playlistId.split(':');
    if (type != 'my' && type != 'dj') {
        // FIXME: Better error message
        throw new Error('Not supported playlist type');
    }

    const {
        title,
        count,
        trackInfo: trackData,
    } = await this.getFirstPlaylistTracks(type, id);

    const requestArr: Promise<AxiosResponse<any, any>>[] = [];
    for (let i = 1; i < Math.ceil(count / pageSize); i++) {
        requestArr.push(
            axios.get(playlistPagingUrl[type], {
                params: {
                    startIndex: i * pageSize + 1,
                    pageSize: pageSize,
                },
                headers: {
                    Referer: `${playlistUrl[type]}?plylstSeq=${id}`,
                },
            }),
        );
    }

    await axios.all(requestArr).then((responses) => {
        for (const response of responses) {
            const $ = cheerio.load(response.data);
            $('table > tbody > tr').each((_, el) => {
                if (type === 'my') {
                    trackData.push(
                        this.melonTrackScraper.scrapeMyMusicTrack($, el),
                    );
                } else if (type === 'dj') {
                    trackData.push(this.melonTrackScraper.scrapeTrack($, el));
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
        streamTrack.streamId = data?.streamId;

        const track = new Track();
        track.title = data?.title;

        // Album entity
        const streamAlbum = new StreamAlbum();
        streamAlbum.streamId = data?.albumId;
        streamAlbum.streamType = 'melon';

        const album = new Album();
        album.title = data?.album;
        // TODO: Get date when parse from melon
        // album.realeaseDate = new Date();

        // Artists entity
        const artists: Artist[] = [];
        for (let i = 0; i < data?.artists?.length; i++) {
            const streamArtist = new StreamArtist();
            streamArtist.streamId = data?.artistIds[i];
            streamArtist.streamType = 'melon';

            const artist = new Artist();
            artist.name = data?.artists[i];
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

import { Album } from '@/album/album.entity.js';
import { StreamAlbum } from '@/album/streamAlbum.entity.js';
import { Artist } from '@/artist/artist.entity.js';
import { StreamArtist } from '@/artist/streamArtist.entity.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata } from '@/authdata/types.js';
import { Playlist } from '@/playlist/playlist.entity.js';
import { StreamPlaylist } from '@/playlist/streamPlaylist.entity.js';
import { MelonTrackScraper } from '@/track-scraper/melon-track-scraper.service.js';
import { StreamTrack } from '@/track/streamTrack.entity.js';
import { Track } from '@/track/track.entity.js';
import { TrackService } from '@/track/track.service.js';
import { TrackInfo } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { PlaylistScraper } from './PlaylistScraper.js';

@Injectable()
export class MelonPlaylistScraper implements PlaylistScraper {
    private readonly playlistUrl = {
        dj: 'https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm',
        norm: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm',
    };
    private readonly playlistPagingUrl = {
        dj: 'https://www.melon.com/dj/playlist/djplaylist_listsong.htm?',
        norm: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_listPagingSong.htm',
    };
    private readonly createPlaylistUrl =
        'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insertAction.json';
    private readonly pageSize = 50;

    constructor(
        protected readonly authdataService: AuthdataService,
        protected readonly melonTrackScraper: MelonTrackScraper,
        protected readonly trackService: TrackService,
    ) {}

    async getPlaylist(playlistId: string): Promise<Playlist> {
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
        for (let i = 1; i < Math.ceil(count / this.pageSize); i++) {
            requestArr.push(
                axios.get(this.playlistPagingUrl[type], {
                    params: {
                        startIndex: i * this.pageSize + 1,
                        pageSize: this.pageSize,
                    },
                    headers: {
                        Referer: `${this.playlistUrl[type]}?plylstSeq=${id}`,
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
                        trackData.push(
                            this.melonTrackScraper.scrapeTrack($, el),
                        );
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

    public async savePlaylist(playlist: Playlist, melonAuthData: Authdata) {
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

        const response = await axios.post(this.createPlaylistUrl, data, {
            headers: {
                Cookie: this.authdataService.toString('melon', melonAuthData),
                Referer:
                    'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insert.htm',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        return response.data.result;
    }

    async getFirstPlaylistTracks(
        type: 'my' | 'dj',
        playlistId: string,
    ): Promise<{
        title: string;
        count: number;
        trackInfo: TrackInfo[];
    }> {
        const response = await axios.get(this.playlistUrl[type], {
            params: {
                plylstSeq: playlistId,
            },
        });

        const $ = cheerio.load(response.data);
        const count = $(
            '#conts > div.section_contin > div.page_header > h5 > span',
        ).text();
        const title = $(
            '#conts > div.section_info.d_djcol_list > div > div.entry > div.info > div.ellipsis.song_name',
        ).text();
        const trackData: TrackInfo[] = [];

        $('table > tbody > tr').each((_, el) => {
            if (type === 'my') {
                trackData.push(
                    this.melonTrackScraper.scrapeMyMusicTrack($, el),
                );
            } else if (type === 'dj') {
                trackData.push(this.melonTrackScraper.scrapeTrack($, el));
            }
        });

        return {
            title,
            count: parseInt(count, 10),
            trackInfo: trackData,
        };
    }
}

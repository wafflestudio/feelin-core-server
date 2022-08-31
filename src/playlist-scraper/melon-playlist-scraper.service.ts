import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata } from '@/authdata/types.js';
import { Playlist } from '@/playlist/entity/playlist.entity.js';
import { IPlaylist } from '@/playlist/types/types.js';
import { MelonTrackScraper } from '@/track-scraper/melon-track-scraper.service.js';
import { Track } from '@/track/entity/track.entity.js';
import { TrackService } from '@/track/track.service.js';
import { ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import cheerio from 'cheerio';
import { PlaylistScraper } from './PlaylistScraper.js';

@Injectable()
export class MelonPlaylistScraper implements PlaylistScraper {
    private readonly playlistUrl = {
        dj: 'https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm',
        user: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm',
    };
    private readonly playlistPagingUrl = {
        dj: 'https://www.melon.com/dj/playlist/djplaylist_listsong.htm',
        user: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_listPagingSong.htm',
    };
    private readonly createPlaylistUrl =
        'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insertAction.json';
    private readonly pageSize = 50;

    constructor(
        protected readonly authdataService: AuthdataService,
        protected readonly melonTrackScraper: MelonTrackScraper,
        protected readonly trackService: TrackService,
    ) {}

    async getPlaylist(playlistId: string): Promise<IPlaylist> {
        const [type, id] = playlistId.split(':');
        if (type != 'user' && type != 'dj') {
            // FIXME: Better error message
            throw new Error('unsupported playlist type');
        }

        const { title, count, trackData } = await this.getFirstPlaylistTracks(type, id);

        const requestArr = [...Array(Math.ceil(count / this.pageSize) - 1).keys()].map((i) =>
            axios.get(this.playlistPagingUrl[type], {
                params: {
                    plylstSeq: id,
                    startIndex: (i + 1) * this.pageSize + 1,
                    pageSize: this.pageSize,
                },
                headers: {
                    Referer: `${this.playlistUrl[type]}?plylstSeq=${id}`,
                },
            }),
        );

        const response = await axios.all(requestArr);
        response.forEach((response) => {
            const $ = cheerio.load(response.data);
            $('table > tbody > tr').map((_, el) => {
                trackData.push(this.melonTrackScraper.scrapeTrack($, el));
            });
        });

        return { vendor: 'melon', title: title.trim(), id: playlistId, tracks: trackData };
    }

    public async savePlaylist(playlist: Playlist, tracks: Track[], melonAuthData: Authdata) {
        const params = {
            plylstTitle: playlist.title,
            // FIXME: description should come from post
            playlistDesc: '',
            openYn: 'Y',
            repntImagePath: '',
            repntImagePathDefaultYn: 'N',
        };
        const data = new URLSearchParams(params);
        const streamTracks = await this.trackService.findAllStreamTracks(tracks);
        tracks.map((track) => {
            const melonId = streamTracks.find(
                (streamTrack) => streamTrack.track === track && streamTrack?.vendor === 'melon',
            )?.vendorId;
            if (melonId) {
                data.append('songIds[]', melonId);
            }
        });

        const response = await axios.post(this.createPlaylistUrl, data, {
            headers: {
                Cookie: this.authdataService.toString('melon', melonAuthData),
                Referer: 'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insert.htm',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        return response.data.result;
    }

    async getFirstPlaylistTracks(
        type: 'user' | 'dj',
        playlistId: string,
    ): Promise<{
        title: string;
        count: number;
        trackData: ITrack[];
    }> {
        const response = await axios.get(this.playlistUrl[type], {
            params: { plylstSeq: playlistId },
        });

        // TODO: change to method which is more resistant to change
        const $ = cheerio.load(response.data);
        const count = $('div.page_header')
            .text()
            .match(/수록곡 \((\d+)\)/)
            .pop();
        const title = $('div.ellipsis.song_name').text();

        const trackData: ITrack[] = [];
        $('table > tbody > tr').each((_, el) => {
            trackData.push(this.melonTrackScraper.scrapeTrack($, el));
        });

        return {
            title,
            count: parseInt(count, 10),
            trackData: trackData,
        };
    }
}

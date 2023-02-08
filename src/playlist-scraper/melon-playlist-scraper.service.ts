import { VendorPlaylistDto } from '@/playlist/dto/vendor-playlist.dto.js';
import { PlaylistInfo } from '@/playlist/types/types.js';
import { MelonTrackScraper } from '@/track-scraper/melon-track-scraper.service.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { TrackInfo } from '@/types/types.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable } from '@nestjs/common';
import { VendorPlaylist, VendorTrack } from '@prisma/client';
import axios from 'axios';
import cheerio from 'cheerio';
import { playlistUrlsByVendor } from './constants.js';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class MelonPlaylistScraper implements PlaylistScraper {
    constructor(
        protected readonly melonTrackScraper: MelonTrackScraper,
        protected readonly vendorTrackRepository: VendorTrackRepository,
    ) {}

    private readonly pageSize = 50;
    private readonly playlistUrls = playlistUrlsByVendor['melon'];

    async getPlaylist(playlistId: string): Promise<PlaylistInfo> {
        const [type, id] = playlistId.split(':');
        if (type != 'user' && type != 'catalog') {
            // FIXME: Better error message
            throw new Error('unsupported playlist type');
        }

        const { title, count, trackData } = await this.getFirstPlaylistTracks(type, id);

        const requestArr = [...Array(Math.ceil(count / this.pageSize) - 1).keys()].map((i) =>
            axios.get(this.playlistUrls.getPlaylistPaged[type], {
                params: {
                    plylstSeq: id,
                    startIndex: (i + 1) * this.pageSize + 1,
                    pageSize: this.pageSize,
                },
                headers: {
                    Referer: `${this.playlistUrls.getPlaylist[type]}?plylstSeq=${id}`,
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

        return { title: title.trim(), id: playlistId, coverUrl: '', tracks: trackData.filter((x) => x) };
    }

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: VendorTrack[], authdata: Authdata) {
        const params = {
            plylstTitle: request.title,
            // FIXME: description should come from post
            playlistDesc: '',
            openYn: 'Y',
            repntImagePath: '',
            repntImagePathDefaultYn: 'N',
        };
        const data = new URLSearchParams(params);
        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(
            'melon',
            tracks.map(({ id }) => id),
        );
        tracks.forEach(({ id }) => {
            if (!!vendorTracks[id]) {
                data.append('songIds[]', vendorTracks[id].vendorId);
            }
        });

        const response = await axios.post(this.playlistUrls.createPlaylist, data, {
            headers: {
                Cookie: authdata.accessToken,
                Referer: 'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insert.htm',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        return response.data.result;
    }

    async getFirstPlaylistTracks(
        type: 'user' | 'catalog',
        playlistId: string,
    ): Promise<{
        title: string;
        count: number;
        trackData: TrackInfo[];
    }> {
        const response = await axios.get(this.playlistUrls.getPlaylist[type], {
            params: { plylstSeq: playlistId },
        });

        // TODO: change to method which is more resistant to change
        const $ = cheerio.load(response.data);
        const count = $('.title')
            .toArray()
            .flatMap((node) =>
                $(node)
                    .text()
                    .match(/수록곡 \((\d+)\)/)
                    ?.pop(),
            )
            .filter((x) => x)
            ?.pop();
        const title = $('div.ellipsis.song_name').text();

        const trackData: TrackInfo[] = [];
        $('table > tbody > tr').each((_, el) => {
            trackData.push(this.melonTrackScraper.scrapeTrack($, el));
        });

        return {
            title,
            count: parseInt(count, 10),
            trackData: trackData,
        };
    }

    getVendorPlaylistDto(vendorPlaylist: VendorPlaylist): VendorPlaylistDto {
        throw new Error('Method not implemented.');
    }
}

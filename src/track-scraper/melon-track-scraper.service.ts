import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, MelonAuthdata } from '@/authdata/types.js';
import { IAlbum, IArtist, ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import randomUseragent from 'random-useragent';
import { TrackScraper } from './TrackScraper.js';

@Injectable()
export class MelonTrackScraper implements TrackScraper {
    private readonly recentTrackUrl = 'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm';
    private readonly recentTrackListUrl = 'https://www.melon.com/mymusic/recent/mymusicrecentsong_listPaging.htm';
    private readonly melonURL = 'https://www.melon.com/search/song/index.htm';
    private readonly melonCoverUrl = (id: string, origId: string, size: number) =>
        `https://cdnimg.melon.co.kr/cm/album/images/${id.slice(0, 3)}/${id.slice(3, 5)}/${id.slice(5)}` +
        `/${origId}_500.jpg/melon/resize/${size}/quality/80/optimize`;

    private readonly pageSize = 50;

    constructor(protected readonly authdataService: AuthdataService) {}

    async searchTrack(track: ITrack): Promise<ITrack[]> {
        // Melon search API limits max 50 results at once
        const response = await axios.get(this.melonURL, {
            params: {
                startIndex: 1,
                pageSize: 50,
                q: track.title,
                sort: 'weight',
                section: 'song',
            },
            headers: {
                'User-Agent': randomUseragent.getRandom(),
            },
        });
        const $ = cheerio.load(response.data);
        const trackList: ITrack[] = [];
        $('table > tbody > tr').each((_, el) => {
            trackList.push(this.scrapeTrack($, el));
        });

        return trackList;
    }

    scrapeTrack($: cheerio.Root, el: cheerio.Element): ITrack {
        const trackInfoNodes = $(el).find('div.ellipsis');

        const trackNode = trackInfoNodes
            .find('a')
            .toArray()
            .filter((node) => $(node).attr('href').includes('playSong'))
            .pop();
        const artistNodes = trackInfoNodes
            .find('div > a')
            .toArray()
            .filter((node) => $(node).attr('href').includes('ArtistDetail'));
        const albumNode = trackInfoNodes
            .find('a')
            .toArray()
            .filter((node) => $(node).attr('href').includes('AlbumDetail'))
            .pop();

        if (!trackNode) {
            return null;
        }

        const title = $(trackNode).text();
        const id = $(trackNode)
            .attr('href')
            .match(/\(\'.*\',(.*)\)/)
            .pop();
        const artists: IArtist[] = artistNodes.map((node) => ({
            vendor: 'melon',
            name: $(node).text(),
            id: $(node)
                .attr('href')
                .match(/\(\'(.*)\'\)/)
                .pop(),
        }));
        const albumId = $(albumNode)
            .attr('href')
            .match(/\(\'(.*)\'\)/)
            .pop();
        const album: IAlbum = {
            vendor: 'melon',
            title: $(albumNode).text(),
            id: albumId,
            coverUrl: this.melonCoverUrl(albumId.padStart(8, '0'), albumId, 240),
        };

        return { vendor: 'melon', title, id, artists, album };
    }

    async getMyRecentTracks(authdata: Authdata) {
        const melonAuthdata = authdata as MelonAuthdata;

        const { count, recentTracks } = await this.getFirstRecentTracks(melonAuthdata);
        const requestArr: Promise<AxiosResponse<any, any>>[] = [];
        for (let i = 1; i < Math.ceil(count / this.pageSize); i++) {
            requestArr.push(
                axios.get(this.recentTrackListUrl, {
                    params: {
                        startIndex: i * this.pageSize + 1,
                        pageSize: this.pageSize,
                        memberKey: melonAuthdata['keyCookie'],
                    },
                    headers: {
                        Cookie: this.authdataService.toString('melon', melonAuthdata),
                        Referer: `${this.recentTrackUrl}?memberKey=${melonAuthdata['keyCookie']}`,
                    },
                }),
            );
        }
        await axios.all(requestArr).then((responses) => {
            for (const response of responses) {
                const $ = cheerio.load(response.data);
                $('table > tbody > tr').each((_, el) => {
                    recentTracks.push(this.scrapeTrack($, el));
                });
            }
        });

        return recentTracks;
    }

    async getFirstRecentTracks(melonAuthdata: MelonAuthdata): Promise<{
        count: number;
        recentTracks: ITrack[];
    }> {
        const response = await axios.get(this.recentTrackUrl, {
            params: {
                memberKey: melonAuthdata['keyCookie'],
            },
            headers: {
                Cookie: this.authdataService.toString('melon', melonAuthdata),
            },
        });
        const $ = cheerio.load(response.data);
        const count = $('#conts > div.wrab_list_info > div > span > span').text();

        const recentTracks: ITrack[] = [];
        $('table > tbody > tr').each((_, el) => {
            recentTracks.push(this.scrapeTrack($, el));
        });

        return {
            count: parseInt(count, 10),
            recentTracks,
        };
    }
}

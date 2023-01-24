import { SearchResults } from '@/track/types/types.js';
import { CookieUtilService } from '@/utils/cookie-util/cookie-util.service.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { AlbumInfo, ArtistInfo, TrackInfo } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import randomUseragent from 'random-useragent';
import { trackUrlsByVendor } from './constants.js';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class MelonTrackScraper implements TrackScraper {
    constructor(private readonly cookieUtilService: CookieUtilService) {}

    private readonly melonCoverUrl = (id: string, origId: string, size: number) =>
        `https://cdnimg.melon.co.kr/cm/album/images/${id.slice(0, 3)}/${id.slice(3, 5)}/${id.slice(5)}` +
        `/${origId}_500.jpg/melon/resize/${size}/quality/80/optimize`;
    private readonly pageSize = 50;
    private readonly trackUrls = trackUrlsByVendor['melon'];

    async searchTrack(track: TrackInfo): Promise<SearchResults> {
        // Melon search API limits max 50 results at once
        const response = await axios.get(this.trackUrls.search, {
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
        const trackList: TrackInfo[] = [];
        $('table > tbody > tr').each((_, el) => {
            trackList.push(this.scrapeTrack($, el));
        });

        return { isDetailed: true, results: trackList };
    }

    scrapeTrack($: cheerio.Root, el: cheerio.Element): TrackInfo {
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
        const artists: ArtistInfo[] = artistNodes.map((node) => ({
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
        const album: AlbumInfo = {
            title: $(albumNode).text(),
            id: albumId,
            coverUrl: this.melonCoverUrl(albumId.padStart(8, '0'), albumId, 240),
        };

        return { title, id, duration: 0, artists, artistNames: '', album, albumTitle: '' };
    }

    async getMyRecentTracks(authdata: Authdata) {
        const { count, recentTracks } = await this.getFirstRecentTracks(authdata);
        const requestArr: Promise<AxiosResponse<any, any>>[] = [];
        for (let i = 1; i < Math.ceil(count / this.pageSize); i++) {
            requestArr.push(
                axios.get(this.trackUrls.recentlyPlayed, {
                    params: {
                        startIndex: i * this.pageSize + 1,
                        pageSize: this.pageSize,
                        memberKey: this.cookieUtilService.getValue(authdata.accessToken, 'keyCookie'),
                    },
                    headers: {
                        Cookie: authdata.accessToken,
                        Referer: `${this.trackUrls.recentlyPlayedPaged}?memberKey=${this.cookieUtilService.getValue(
                            authdata.accessToken,
                            'keyCookie',
                        )}`,
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

    async getFirstRecentTracks(authdata: Authdata): Promise<{
        count: number;
        recentTracks: TrackInfo[];
    }> {
        const response = await axios.get(this.trackUrls.recentlyPlayed, {
            params: {
                memberKey: this.cookieUtilService.getValue(authdata.accessToken, 'keyCookie'),
            },
            headers: { Cookie: authdata.accessToken },
        });
        const $ = cheerio.load(response.data);
        const count = $('#conts > div.wrab_list_info > div > span > span').text();

        const recentTracks: TrackInfo[] = [];
        $('table > tbody > tr').each((_, el) => recentTracks.push(this.scrapeTrack($, el)));

        return { count: parseInt(count, 10), recentTracks };
    }
}

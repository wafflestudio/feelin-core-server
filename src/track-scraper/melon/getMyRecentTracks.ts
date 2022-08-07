import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { MelonAuthdata } from '@authdata/types.js';
import MelonTrackScraper from './index.js';

async function getMyRecentTracks(
    this: MelonTrackScraper,
    cookie: MelonAuthdata,
) {
    const recentTrackUrl =
        'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm';
    const recentTrackListUrl =
        'https://www.melon.com/mymusic/recent/mymusicrecentsong_listPaging.htm';
    const pageSize = 50;

    const { count, recentTracks } = await this.getFirstRecentTracks(cookie);
    const requestArr: Promise<AxiosResponse<any, any>>[] = [];
    for (let i = 1; i < Math.ceil(count / pageSize); i++) {
        requestArr.push(
            axios.get(recentTrackListUrl, {
                params: {
                    startIndex: i * pageSize + 1,
                    pageSize: pageSize,
                    memberKey: cookie['keyCookie'],
                },
                headers: {
                    Cookie: this.authdataService.toString('melon', cookie),
                    Referer: `${recentTrackUrl}?memberKey=${cookie['keyCookie']}`,
                },
            }),
        );
    }
    await axios.all(requestArr).then((responses) => {
        for (const response of responses) {
            const $ = cheerio.load(response.data);
            $('table > tbody > tr').each((_, el) => {
                recentTracks.push(this.scrapeMyMusicTrack($, el));
            });
        }
    });

    return recentTracks;
}

export default getMyRecentTracks;

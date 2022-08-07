import axios from 'axios';
import cheerio from 'cheerio';
import { TrackInfo } from '@feelin-types/types.js';
import { MelonAuthdata } from '@authdata/types.js';
import MelonTrackScraper from './index.js';

const recentTrackUrl =
    'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm';

async function getFirstRecentTracks(
    this: MelonTrackScraper,
    melonAuthdata: MelonAuthdata,
): Promise<{
    count: number;
    recentTracks: TrackInfo[];
}> {
    const response = await axios.get(recentTrackUrl, {
        params: {
            memberKey: melonAuthdata['keyCookie'],
        },
        headers: {
            Cookie: this.authdataService.toString('melon', melonAuthdata),
        },
    });
    const $ = cheerio.load(response.data);
    const count = $('#conts > div.wrab_list_info > div > span > span').text();

    const recentTracks: TrackInfo[] = [];
    $('table > tbody > tr').each((_, el) => {
        recentTracks.push(this.scrapeMyMusicTrack($, el));
    });

    return {
        count: parseInt(count, 10),
        recentTracks,
    };
}

export default getFirstRecentTracks;

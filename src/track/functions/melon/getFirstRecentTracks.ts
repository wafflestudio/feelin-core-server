import axios from 'axios';
import * as cheerio from 'cheerio';
import { CookieData, TrackInfo } from 'src/types';
import scrapeMyMusicTrack from './scrapeMyMusicTrack';

const recentTrackUrl =
    'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm';

async function getFirstRecentTracks(cookie: CookieData): Promise<{
    count: number;
    recentTracks: TrackInfo[];
}> {
    let response = await axios.get(recentTrackUrl, {
        params: {
            memberKey: cookie.getCookie('keyCookie'),
        },
        headers: {
            Cookie: cookie.toString(),
        },
    });
    const $ = cheerio.load(response.data);
    const count = $('#conts > div.wrab_list_info > div > span > span').text();

    let recentTracks: TrackInfo[] = [];
    $('table > tbody > tr').each((_, el) => {
        recentTracks.push(scrapeMyMusicTrack($, el));
    });

    return {
        count: parseInt(count, 10),
        recentTracks,
    };
}

export default getFirstRecentTracks;

import axios from 'axios';
import cheerio from 'cheerio';
import { CookieData, TrackInfo } from 'src/types';
import scrapeMyMusicTrack from './scrapeMyMusicTrack';

const recentTrackUrl =
    'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm';

async function getFirstRecentTracks(cookie: CookieData): Promise<{
    count: number;
    recentTracks: TrackInfo[];
}> {
    const response = await axios.get(recentTrackUrl, {
        params: {
            memberKey: cookie.getCookie('keyCookie'),
        },
        headers: {
            Cookie: cookie.toString('melon'),
        },
    });
    const $ = cheerio.load(response.data);
    const count = $('#conts > div.wrab_list_info > div > span > span').text();

    const recentTracks: TrackInfo[] = [];
    $('table > tbody > tr').each((_, el) => {
        const {
            title: track,
            trackId,
            artists,
            album,
        } = scrapeMyMusicTrack($, el);
        recentTracks.push(
            new TrackInfo(track, artists, album, 'melon', trackId),
        );
    });

    return {
        count: parseInt(count, 10),
        recentTracks,
    };
}

export default getFirstRecentTracks;

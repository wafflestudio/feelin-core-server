import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { CookieData, TrackInfo } from 'src/types';
import getFirstRecentTracks from './getFirstRecentTracks';
import scrapeMyMusicTrack from './scrapeMyMusicTrack';

async function getMyRecentTracks(cookie: CookieData) {
    const recentTrackUrl =
        'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm';
    const recentTrackListUrl =
        'https://www.melon.com/mymusic/recent/mymusicrecentsong_listPaging.htm';
    const pageSize = 50;

    const { count, recentTracks } = await getFirstRecentTracks(cookie);
    const requestArr: Promise<AxiosResponse<any, any>>[] = [];
    for (let i = 1; i < Math.ceil(count / pageSize); i++) {
        requestArr.push(
            axios.get(recentTrackListUrl, {
                params: {
                    startIndex: i * pageSize + 1,
                    pageSize: pageSize,
                    memberKey: cookie.getCookie('keyCookie'),
                },
                headers: {
                    Cookie: cookie.toString('melon'),
                    Referer: `${recentTrackUrl}?memberKey=${cookie.getCookie(
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
        }
    });

    return recentTracks;
}

export default getMyRecentTracks;

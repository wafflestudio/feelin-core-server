import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { CookieData, TrackInfo } from '../../types';

const recentTrackUrl =
    'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm';
const recentTrackListUrl =
    'https://www.melon.com/mymusic/recent/mymusicrecentsong_listPaging.htm';

async function getRecentTrackCount(cookie: CookieData) {
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
    return parseInt(count, 10);
}

const getTrackInfo = function (
    $: cheerio.Root,
    el: cheerio.Element,
): TrackInfo {
    const TITLE_NODE = 0;
    const ARTIST_NODE = 1;
    const ALBUM_NODE = 2;

    let title: string;
    let id: string;
    let artists: string[] = [];
    let album: string;
    $(el)
        .find('td.t_left > div.wrap > div.ellipsis')
        .each((index, el) => {
            switch (index) {
                case TITLE_NODE: {
                    id = $(el)
                        .find('a.btn')
                        .attr('href')
                        .match(/\(\'(\w+)\'\)/)[1];
                    title = $(el).find('a').last().text();
                    break;
                }
                case ARTIST_NODE: {
                    $(el)
                        .find('span > a')
                        .each((j, el) => {
                            const melonArtistId: string = $(el)
                                .attr('href')
                                .match(/\(\'(\w+)\'\)/)[1];
                            const artistName: string = $(el).text();
                            artists.push(artistName);
                        });
                    break;
                }
                case ALBUM_NODE: {
                    const melonAlbumId: string = $(el)
                        .find('a')
                        .attr('href')
                        .match(/\(\'(\w+)\'\)/)[1];
                    album = $(el).find('a').text();
                    break;
                }
            }
        });

    return new TrackInfo('melon', title, id, artists, album);
};

async function getMyRecentTracks(cookie: CookieData) {
    const pageSize = 50;
    const recentTrackCount = await getRecentTrackCount(cookie);
    console.log(recentTrackCount);
    let requestArr: Array<Promise<AxiosResponse<any, any>>> = new Array();

    for (let i = 0; i < Math.floor(recentTrackCount / pageSize); i++) {
        requestArr.push(
            axios.get(recentTrackListUrl, {
                params: {
                    startIndex: i * pageSize + 1,
                    pageSize: pageSize,
                    memberKey: cookie.getCookie('keyCookie'),
                },
                headers: {
                    Cookie: cookie.toString(),
                    Referer: `${recentTrackUrl}?memberKey=${cookie.getCookie(
                        'keyCookie',
                    )}`,
                },
            }),
        );
    }
    let recentTracks: Array<TrackInfo> = new Array();
    await axios.all(requestArr).then((responses) => {
        for (const response of responses) {
            const $ = cheerio.load(response.data);
            $('table > tbody > tr').each((_, el) => {
                recentTracks.push(getTrackInfo($, el));
            });
        }
    });

    return recentTracks;
}

export default getMyRecentTracks;

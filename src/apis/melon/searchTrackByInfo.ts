import axios from 'axios';
import * as cheerio from 'cheerio';
import { trackInfo } from '../../types';

const TITLE_NODE = 0;
const ARTIST_NODE = 1;
const ALBUM_NODE = 2;

const getTrackInfo = function ($: cheerio.CheerioAPI, el: cheerio.Element) {
    let title: string;
    let artists: string[] = [];
    let album: string;
    $(el)
        .find('td.t_left > div.wrap > div.ellipsis')
        .each((index, el) => {
            switch (index) {
                case TITLE_NODE: {
                    const melonID: string = $(el)
                        .find('a.btn')
                        .attr('href')
                        .match(/\(\'(\w+)\'\)/)[1];
                    title = $(el).find('a.fc_gray').last().text();
                    break;
                }
                case ARTIST_NODE: {
                    $(el)
                        .find('span > a')
                        .each((j, el) => {
                            const melonArtistID: string = $(el)
                                .attr('href')
                                .match(/\(\'(\w+)\'\)/)[1];
                            const artistName: string = $(el).text();
                            artists.push(artistName);
                        });
                    break;
                }
                case ALBUM_NODE: {
                    const melonAlbumID: string = $(el)
                        .find('a')
                        .attr('href')
                        .match(/\(\'(\w+)\'\)/)[1];
                    album = $(el).find('a').text();
                    break;
                }
            }
        });

    return new trackInfo('melon', title, artists, album);
};

let searchTrackByInfo = async function (
    trackInfo: trackInfo,
): Promise<trackInfo | void> {
    const melonURL = 'https://www.melon.com/search/song/index.htm?';
    const response = await axios.get(melonURL, {
        params: {
            startIndex: 1,
            pagesize: 50,
            q: trackInfo.title,
            sort: 'weight',
            section: 'song',
            mwkLogType: 'T',
        },
    });
    const $ = cheerio.load(response.data);
    let trackSearchResult: trackInfo;
    $('table > tbody > tr').each((_, el) => {
        trackSearchResult = getTrackInfo($, el);
        if (trackInfo.isEqual(trackSearchResult)) {
            return false;
        }
    });
    return trackSearchResult;
};

export default searchTrackByInfo;

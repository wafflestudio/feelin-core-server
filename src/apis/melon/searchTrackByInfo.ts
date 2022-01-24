import axios from 'axios';
import * as cheerio from 'cheerio';
import { TrackInfo } from '../../types';

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

    return new TrackInfo('melon', title, id, artists, album);
};

const searchTrackByInfo = async function (
    trackInfo: TrackInfo,
): Promise<TrackInfo | void> {
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
    let trackSearchResult: TrackInfo;
    $('table > tbody > tr').each((_, el) => {
        trackSearchResult = getTrackInfo($, el);
        if (trackInfo.isEqual(trackSearchResult)) {
            return false;
        }
    });
    return trackSearchResult;
};

export default searchTrackByInfo;

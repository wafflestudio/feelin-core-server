import { TrackInfo } from 'src/types';

/**
 *
 * @param $ cheerio.Root of the HTML page
 * @param el cheerio.Element of the single Track HTML
 * @returns TrackInfo Object containing the information.
 *
 * Use when scraping information for searching Tracks, scraping dj playlists
 */
function scrapeTrack($: cheerio.Root, el: cheerio.Element): TrackInfo {
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
                            const artistID: string = $(el)
                                .attr('href')
                                .match(/\(\'(\w+)\'\)/)[1];
                            const artistName: string = $(el).text();
                            artists.push(artistName);
                        });
                    break;
                }
                case ALBUM_NODE: {
                    const albumID: string = $(el)
                        .find('a')
                        .attr('href')
                        .match(/\(\'(\w+)\'\)/)[1];
                    album = $(el).find('a').text();
                    break;
                }
            }
        });

    return new TrackInfo(title, artists, album, 'melon', id);
}

export default scrapeTrack;

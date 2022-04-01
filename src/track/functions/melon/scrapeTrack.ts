import TrackData from './TrackData';

/**
 *
 * @param $ cheerio.Root of the HTML page
 * @param el cheerio.Element of the single Track HTML
 * @returns TrackInfo Object containing the information.
 *
 * Use when scraping information for searching Tracks, scraping dj playlists
 */
const TITLE_NODE = 0;
const ARTIST_NODE = 1;
const ALBUM_NODE = 2;

function scrapeTrack($: cheerio.Root, el: cheerio.Element): TrackData {
    let title: string;
    let trackId: string;
    const artists: string[] = [];
    const artistIds: string[] = [];
    let album: string;
    let albumId: string;

    $(el)
        .find('td.t_left > div.wrap > div.ellipsis')
        .each((index, el) => {
            switch (index) {
                case TITLE_NODE: {
                    trackId = $(el)
                        .find('a.btn')
                        .attr('href')
                        .match(/\(\'(\w+)\'\)/)[1];
                    title = $(el).find('a.fc_gray').last().text();
                    break;
                }
                case ARTIST_NODE: {
                    $(el)
                        .find('span > a')
                        .each((_, el) => {
                            const artistId = $(el)
                                .attr('href')
                                .match(/\(\'(\w+)\'\)/)[1];
                            const artist: string = $(el).text();

                            artists.push(artist);
                            artistIds.push(artistId);
                        });
                    break;
                }
                case ALBUM_NODE: {
                    albumId = $(el)
                        .find('a')
                        .attr('href')
                        .match(/\(\'(\w+)\'\)/)[1];
                    album = $(el).find('a').text();
                    break;
                }
            }
        });

    return {
        title,
        trackId,
        artists,
        artistIds,
        album,
        albumId,
    };
}

export default scrapeTrack;

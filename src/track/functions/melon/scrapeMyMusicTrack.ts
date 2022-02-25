import { TrackInfo } from 'src/types';

function scrapeMyMusicTrack($: cheerio.Root, el: cheerio.Element): TrackInfo {
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
                            const artistId: string = $(el)
                                .attr('href')
                                .match(/\(\'(\w+)\'\)/)[1];
                            const artistName: string = $(el).text();
                            artists.push(artistName);
                        });
                    break;
                }
                case ALBUM_NODE: {
                    const albumId: string = $(el)
                        .find('a')
                        .attr('href')
                        .match(/\(\'(\w+)\'\)/)[1];
                    album = $(el).find('a').text();
                    break;
                }
            }
        });

    return new TrackInfo('melon', title, id, artists, album);
}

export default scrapeMyMusicTrack;

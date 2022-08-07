import { TrackInfo } from '@feelin-types/types.js';
import MelonTrackScraper from '.';

const TRACK_NODE = 0;
const ARTIST_NODE = 1;
const ALBUM_NODE = 2;

export default function scrapeMyMusicTrack(
    this: MelonTrackScraper,
    $: cheerio.Root,
    el: cheerio.Element,
): TrackInfo {
    let title: string;
    let streamId: string;
    const artists: string[] = [];
    const artistIds: string[] = [];
    let album: string;
    let albumId: string;

    $(el)
        .find('td.t_left > div.wrap > div.ellipsis')
        .each((index, el) => {
            switch (index) {
                case TRACK_NODE: {
                    streamId = $(el)
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
        streamType: 'melon',
        title,
        streamId,
        artists,
        artistIds,
        album,
        albumId,
    };
}

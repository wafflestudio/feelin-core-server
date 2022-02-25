import axios, { AxiosResponse } from 'axios';
import * as cheerio from 'cheerio';
import { melonTrack } from 'src/track/functions';
import getFirstPlaylistTracks from './getFirstPlaylistTracks';

const playlistPagingUrl = {
    dj: 'https://www.melon.com/dj/playlist/djplaylist_listsong.htm?',
    norm: '',
};
const pageSize = 50;

async function getPlaylist(type: 'base' | 'dj', playlistId: string) {
    const { count, playlistTracks } = await getFirstPlaylistTracks(
        type,
        playlistId,
    );

    let requestArr: Promise<AxiosResponse<any, any>>[] = [];
    for (let i = 1; i < Math.ceil(count / pageSize); i++) {
        requestArr.push(
            axios.get(playlistPagingUrl[type], {
                params: {
                    startIndex: i * pageSize + 1,
                    pageSize: pageSize,
                },
                headers: {
                    Referer: `${playlistPagingUrl}?plylstSeq=${playlistId}`,
                },
            }),
        );
    }
    await axios.all(requestArr).then((responses) => {
        for (const response of responses) {
            const $ = cheerio.load(response.data);
            $('table > tbody > tr').each((_, el) => {
                if (type === 'base') {
                    playlistTracks.push(melonTrack.scrapeMyMusicTrack($, el));
                } else if (type === 'dj') {
                    playlistTracks.push(melonTrack.scrapeTrack($, el));
                }
            });
        }
    });
}

export default getPlaylist;

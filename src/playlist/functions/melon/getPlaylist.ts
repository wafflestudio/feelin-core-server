import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { MelonTrackUtils } from 'src/track/functions/melon';
import getFirstPlaylistTracks from './getFirstPlaylistTracks';

const playlistPagingUrl = {
    dj: 'https://www.melon.com/dj/playlist/djplaylist_listsong.htm?',
    norm: '',
};
const pageSize = 50;

async function getPlaylist(playlistId: string) {
    const [type, id] = playlistId.split('::');
    if (type != 'base' && type != 'dj') {
        // FIXME: Better error message
        throw new Error('Not supported playlist type');
    }

    const { count, playlistTracks } = await getFirstPlaylistTracks(type, id);

    let requestArr: Promise<AxiosResponse<any, any>>[] = [];
    for (let i = 1; i < Math.ceil(count / pageSize); i++) {
        requestArr.push(
            axios.get(playlistPagingUrl[type], {
                params: {
                    startIndex: i * pageSize + 1,
                    pageSize: pageSize,
                },
                headers: {
                    Referer: `${playlistPagingUrl}?plylstSeq=${id}`,
                },
            }),
        );
    }
    await axios.all(requestArr).then((responses) => {
        for (const response of responses) {
            const $ = cheerio.load(response.data);
            $('table > tbody > tr').each((_, el) => {
                if (type === 'base') {
                    playlistTracks.push(
                        MelonTrackUtils.scrapeMyMusicTrack($, el),
                    );
                } else if (type === 'dj') {
                    playlistTracks.push(MelonTrackUtils.scrapeTrack($, el));
                }
            });
        }
    });
}

export default getPlaylist;

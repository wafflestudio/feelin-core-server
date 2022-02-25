import axios from 'axios';
import * as cheerio from 'cheerio';
import { melonTrack } from 'src/track/functions';
import { TrackInfo } from 'src/types';

const playlistUrl = {
    dj: 'https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm',
    norm: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm',
};

async function getFirstPlaylistTracks(
    type: 'base' | 'dj',
    playlistId: string,
): Promise<{
    count: number;
    playlistTracks: TrackInfo[];
}> {
    let response = await axios.get(playlistUrl[type], {
        params: {
            plylstSeq: playlistId,
        },
    });

    const $ = cheerio.load(response.data);
    const count = $(
        '#conts > div.section_contin > div.page_header > h5 > span',
    ).text();
    const playlistTracks: TrackInfo[] = [];
    $('table > tbody > tr').each((_, el) => {
        if (type === 'base') {
            playlistTracks.push(melonTrack.scrapeMyMusicTrack($, el));
        } else if (type === 'dj') {
            playlistTracks.push(melonTrack.scrapeTrack($, el));
        }
    });

    return {
        count: parseInt(count, 10),
        playlistTracks,
    };
}

export default getFirstPlaylistTracks;

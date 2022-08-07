import { TrackInfo } from '@feelin-types/types.js';
import axios from 'axios';
import cheerio from 'cheerio';
import MelonPlaylistScraper from '.';

const playlistUrl = {
    dj: 'https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm',
    norm: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_inform.htm',
};

async function getFirstPlaylistTracks(
    this: MelonPlaylistScraper,
    type: 'my' | 'dj',
    playlistId: string,
): Promise<{
    title: string;
    count: number;
    trackInfo: TrackInfo[];
}> {
    const response = await axios.get(playlistUrl[type], {
        params: {
            plylstSeq: playlistId,
        },
    });

    const $ = cheerio.load(response.data);
    const count = $(
        '#conts > div.section_contin > div.page_header > h5 > span',
    ).text();
    const title = $(
        '#conts > div.section_info.d_djcol_list > div > div.entry > div.info > div.ellipsis.song_name',
    ).text();
    const trackData: TrackInfo[] = [];

    $('table > tbody > tr').each((_, el) => {
        if (type === 'my') {
            trackData.push(this.melonTrackScraper.scrapeMyMusicTrack($, el));
        } else if (type === 'dj') {
            trackData.push(this.melonTrackScraper.scrapeTrack($, el));
        }
    });

    return {
        title,
        count: parseInt(count, 10),
        trackInfo: trackData,
    };
}

export default getFirstPlaylistTracks;

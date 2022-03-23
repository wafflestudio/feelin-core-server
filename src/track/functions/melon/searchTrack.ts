import axios from 'axios';
import cheerio from 'cheerio';
import { TrackInfo } from 'src/types';
import scrapeTrack from './scrapeTrack';

const melonURL = 'https://www.melon.com/search/song/index.htm?';

async function searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
    // Melon search API limits max 50 results at once
    const response = await axios.get(melonURL, {
        params: {
            startIndex: 1,
            pagesize: 50,
            q: track.title,
            sort: 'weight',
            section: 'song',
            mwkLogType: 'T',
        },
    });
    const $ = cheerio.load(response.data);
    let trackList: TrackInfo[] = [];
    $('table > tbody > tr').each((_, el) => {
        const trackInfo = scrapeTrack($, el);
        trackList.push(trackInfo);
    });

    return trackList;
}

export default searchTrack;

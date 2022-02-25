import axios from 'axios';
import * as cheerio from 'cheerio';
import { TrackInfo } from 'src/types';
import scrapeTrack from './scrapeTrack';

async function searchTrack(trackInfo: TrackInfo): Promise<TrackInfo | void> {
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
        trackSearchResult = scrapeTrack($, el);
        if (trackInfo.isEqual(trackSearchResult)) {
            return false;
        }
    });
    return trackSearchResult;
}

export default searchTrack;

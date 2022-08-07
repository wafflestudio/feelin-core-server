import axios from 'axios';
import cheerio from 'cheerio';
import randomUseragent from 'random-useragent';
import { TrackInfo } from '@feelin-types/types.js';
import MelonTrackScraper from './index.js';

const melonURL = 'https://www.melon.com/search/song/index.htm';

async function searchTrack(
    this: MelonTrackScraper,
    track: TrackInfo,
): Promise<TrackInfo[]> {
    // Melon search API limits max 50 results at once
    const response = await axios.get(melonURL, {
        params: {
            startIndex: 1,
            pageSize: 50,
            q: track.title,
            sort: 'weight',
            section: 'song',
        },
        headers: {
            'User-Agent': randomUseragent.getRandom(),
        },
    });
    const $ = cheerio.load(response.data);
    const trackList: TrackInfo[] = [];
    $('table > tbody > tr').each((_, el) => {
        trackList.push(this.scrapeTrack($, el));
    });

    return trackList;
}

export default searchTrack;

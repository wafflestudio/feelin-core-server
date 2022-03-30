import axios from 'axios';
import cheerio from 'cheerio';
import randomUseragent from 'random-useragent';
import { TrackInfo } from 'src/types';
import scrapeTrack from './scrapeTrack';

const melonURL = 'https://www.melon.com/search/song/index.htm';

async function searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
    // Melon search API limits max 50 results at once
    const response = await axios.get(melonURL, {
        params: {
            startIndex: 1,
            pageSize: 50,
            q: track.titleNoParan,
            sort: 'weight',
            section: 'song',
        },
        headers: {
            'User-Agent': randomUseragent.getRandom(),
        },
    });
    const $ = cheerio.load(response.data);
    let trackList: TrackInfo[] = [];
    $('table > tbody > tr').each((_, el) => {
        const { title: track, trackId, artists, album } = scrapeTrack($, el);
        trackList.push(new TrackInfo(track, artists, album, 'melon', trackId));
    });

    return trackList;
}

export default searchTrack;

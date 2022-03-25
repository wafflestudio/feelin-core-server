import axios from 'axios';
import cheerio from 'cheerio';
import randomUseragent from 'random-useragent';
import { TrackInfo } from 'src/types';
import scrapeTrack from './scrapeTrack';

//?startIndex=1&pageSize=50&q=Straight%2BTo%2BYou&sort=weight&section=song&sectionId=&genreDir=
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
        const trackInfo = scrapeTrack($, el);
        trackList.push(trackInfo);
    });

    return trackList;
}

export default searchTrack;

import { Injectable } from '@nestjs/common';
import TrackScraper from '../TrackScraper.js';
import getMyRecentTracks from './getMyRecentTracks.js';
import searchTrack from './searchTrack.js';
import { Authdata, FloAuthdata } from '@authdata/types.js';
import { AuthdataService } from '@authdata/authdata.service.js';

@Injectable()
class FloTrackScraper implements TrackScraper {
    constructor(protected readonly authdataService: AuthdataService) {}

    public searchTrack = searchTrack;

    public async getMyRecentTracks(authToken: Authdata) {
        return getMyRecentTracks.call(authToken as FloAuthdata);
    }
}

export default FloTrackScraper;

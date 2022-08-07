import { Injectable } from '@nestjs/common';
import TrackScraper from '../TrackScraper.js';
import getMyRecentTracks from './getMyRecentTracks.js';
import getTrack from './getTrack.js';
import scrapeTrack from './scrapeTrack.js';
import searchTrack from './searchTrack.js';
import { Authdata, MelonAuthdata } from '@authdata/types.js';
import { AuthdataService } from '@authdata/authdata.service.js';
import getFirstRecentTracks from './getFirstRecentTracks.js';
import scrapeMyMusicTrack from './scrapeMyMusicTrack.js';

@Injectable()
export default class MelonTrackScraper implements TrackScraper {
    constructor(protected readonly authdataService: AuthdataService) {}

    public searchTrack = searchTrack;

    public getTrack = getTrack;

    public scrapeMyMusicTrack = scrapeMyMusicTrack;

    public scrapeTrack = scrapeTrack;

    public async getMyRecentTracks(authdata: Authdata) {
        return getMyRecentTracks.call(authdata as MelonAuthdata);
    }

    protected getFirstRecentTracks = getFirstRecentTracks;
}

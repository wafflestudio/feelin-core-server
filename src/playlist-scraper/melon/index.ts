import { Injectable } from '@nestjs/common';
import MelonTrackScraper from '@track-scraper/melon/index.js';
import { AuthdataService } from '@authdata/authdata.service.js';
import { Authdata, MelonAuthdata } from '@authdata/types.js';
import { Playlist } from '@playlist/playlist.entity.js';
import PlaylistScraper from '../PlaylistScraper.js';
import getFirstPlaylistTracks from './getFirstPlaylistTracks.js';
import getPlaylist from './getPlaylist.js';
import savePlaylist from './savePlaylist.js';
import { TrackService } from '@track/track.service.js';

@Injectable()
class MelonPlaylistScraper implements PlaylistScraper {
    constructor(
        protected readonly authdataService: AuthdataService,
        protected readonly melonTrackScraper: MelonTrackScraper,
        protected readonly trackService: TrackService,
    ) {}

    public getPlaylist = getPlaylist;

    public async savePlaylist(playlist: Playlist, authData: Authdata) {
        return savePlaylist.call(playlist, authData as MelonAuthdata);
    }

    protected getFirstPlaylistTracks = getFirstPlaylistTracks;
}

export default MelonPlaylistScraper;

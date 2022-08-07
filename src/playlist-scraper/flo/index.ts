import PlaylistScraper from '../PlaylistScraper.js';
import getPlaylist from './getPlaylist.js';
import savePlaylist from './savePlaylist.js';
import { Playlist } from '@playlist/playlist.entity.js';
import { Authdata, FloAuthdata } from '@authdata/types.js';
import { AuthdataService } from '@authdata/authdata.service.js';
import { Injectable } from '@nestjs/common';
import { TrackService } from '@track/track.service.js';

@Injectable()
class FloPlaylistScraper implements PlaylistScraper {
    constructor(
        protected readonly authdataService: AuthdataService,
        protected readonly trackService: TrackService,
    ) {}

    public getPlaylist = getPlaylist;

    public async savePlaylist(playlist: Playlist, authData: Authdata) {
        return savePlaylist.call(playlist, authData as FloAuthdata);
    }
}

export { FloPlaylistScraper };

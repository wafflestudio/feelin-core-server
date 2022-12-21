import { detailId2ApiId, shareId2ApiId } from '@/utils/flo-utils.js';
import { Vendors } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { URL } from 'url';
import { FloPlaylistScraper } from './flo-playlist-scraper.service.js';
import { MelonPlaylistScraper } from './melon-playlist-scraper.service.js';
import { PlaylistScraper } from './playlist-scraper.js';
import { SpotifyPlaylistScraper } from './spotify-playlist-scraper.service.js';

@Injectable()
export class PlaylistScraperService {
    playlistScrapers: { [key in Vendors]: PlaylistScraper };

    constructor(
        private readonly melonPlaylistScraper: MelonPlaylistScraper,
        private readonly floPlaylistScraper: FloPlaylistScraper,
        private readonly spotifyPlaylistScraper: SpotifyPlaylistScraper,
    ) {
        this.playlistScrapers = {
            melon: melonPlaylistScraper,
            flo: floPlaylistScraper,
            spotify: spotifyPlaylistScraper,
        };
    }

    get(vendor: Vendors): PlaylistScraper {
        return this.playlistScrapers[vendor];
    }

    async getStreamAndId(playlistUrl: string): Promise<{
        vendor: Vendors;
        playlistId: string;
    }> {
        let url = new URL(playlistUrl);
        const host = url.host;
        let vendor: Vendors;
        let playlistId = '';
        switch (host) {
            // Melon
            // TODO: Better error message
            case 'kko.to': {
                vendor = 'melon';
                const paths = url.pathname.split('/');
                if (!(paths.length === 2 && paths[0] === '')) {
                    throw new Error('Melon url malformed');
                }

                const res = await fetch(url.toString(), {
                    redirect: 'manual',
                });
                const redirectUrl = res.headers.get('location');
                if (!redirectUrl) {
                    throw new Error('Melon url malformed');
                }

                url = new URL(redirectUrl);
                if (!/m2\.melon\.com\/pda\/msvc\/snsGatePage\.jsp.*/.test(url.host)) {
                    throw new Error('Melon url malformed');
                }

                if (url.searchParams.get('type') === 'djc') {
                    playlistId += 'dj:';
                } else if (url.searchParams.get('type') === 'ply') {
                    playlistId += 'user:';
                } else {
                    throw new Error('not playlist link');
                }

                if (url.searchParams.get('sId')) {
                    playlistId += url.searchParams.get('sId');
                }
                break;
            }

            // TODO: Mobile web (low priority)
            case 'm2.melon.com':

            case 'www.melon.com': {
                vendor = 'melon';
                const path = url.pathname;
                if (/^\/mymusic\/playlist\/mymusicplaylistview_inform.htm[^\/]*/.test(path)) {
                    playlistId += 'user:';
                } else if (/^\/mymusic\/dj\/mymusicdjplaylistview_inform.htm[^\/]*/.test(path)) {
                    playlistId += 'dj:';
                } else {
                    throw new Error('Melon url malformed');
                }

                if (url.searchParams.get('plylstSeq')) {
                    playlistId += url.searchParams.get('plylstSeq');
                } else {
                    throw new Error('Melon url malformed');
                }
                break;
            }

            // Flo
            // http://flomuz.io/s/[r,d]{id}
            case 'flomuz.io': {
                vendor = 'flo';
                const playlistIdMatch = url.pathname.match(/^\/s\/([rd])\.([a-zA-Z0-9]+)/);
                if (playlistIdMatch) {
                    const id = playlistIdMatch.pop();
                    const type = playlistIdMatch.pop() === 'r' ? 'user' : 'dj';
                    playlistId = `${type}:${shareId2ApiId(id)}`;
                } else {
                    throw new Error('Flo url malformed');
                }
                break;
            }

            // https://www.music-flo.com/detail/channel/{id}
            case 'www.music-flo.com': {
                vendor = 'flo';
                const playlistIdMatch = url.pathname.match(/^\/detail\/channel\/([danielzohy]+)/);
                if (playlistIdMatch) {
                    playlistId = `dj:${detailId2ApiId(playlistIdMatch.pop())}`;
                } else {
                    throw new Error('Flo url malformed');
                }
                break;
            }
        }

        return {
            vendor,
            playlistId,
        };
    }
}

import { Injectable } from '@nestjs/common';
import { Vendors } from '@feelin-types/types.js';
import { MelonPlaylistScraper } from './melon-playlist-scraper.service.js';
import { PlaylistScraper } from './PlaylistScraper.js';
import { URL } from 'url';
import { detailId2ApiId, shareId2ApiId } from '@utils/floUtils.js';
import { FloPlaylistScraper } from './flo-playlist-scraper.service.js';

@Injectable()
export class PlaylistScraperService {
    playlistScrapers: { [key in Vendors]: PlaylistScraper };

    constructor(
        private readonly melonPlaylistScraper: MelonPlaylistScraper,
        private readonly floPlaylistScraper: FloPlaylistScraper,
    ) {
        this.playlistScrapers = {
            melon: melonPlaylistScraper,
            flo: floPlaylistScraper,
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
                let paths = url.pathname.split('/');
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
                if (url.host !== 'm2.melon.com') {
                    throw new Error('Melon url malformed');
                }

                paths = url.pathname.split('/');
                if (
                    !(
                        paths.length === 4 &&
                        paths[0] === '' &&
                        paths[1] === 'pda' &&
                        paths[2] === 'msvc' &&
                        paths[3] === 'snsGatePage.jsp'
                    )
                ) {
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
                const paths = url.pathname.split('/');
                if (!(paths.length === 4 && paths[0] === '' && paths[1] === 'mymusic')) {
                    throw new Error('Melon url malformed');
                }

                if (paths[2] === 'playlist' && paths[3] === 'mymusicplaylistview_inform.htm') {
                    playlistId += 'user:';
                } else if (paths[2] === 'dj' && paths[3] === 'mymusicdjplaylistview_inform.htm') {
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
                const paths = url.pathname.split('/');
                if (!(paths.length === 3 && paths[0] === '' && paths[1] === 's' && paths[2].split('.').length === 2)) {
                    throw new Error('Flo url malformed');
                }
                const [type, id] = paths[2].split('.');
                if (type === 'r') {
                    playlistId += 'user:';
                } else if (type === 'd') {
                    playlistId += 'dj:';
                } else {
                    throw new Error('Flo url malformed');
                }
                playlistId += shareId2ApiId(id);
                break;
            }

            // https://www.music-flo.com/detail/channel/{id}
            case 'www.music-flo.com': {
                vendor = 'flo';
                const paths = url.pathname.split('/');
                if (!(paths.length === 4 && paths[0] === '' && paths[1] === 'detail' && paths[2] === 'channel')) {
                    throw new Error('Flo url malformed');
                }
                playlistId += 'dj:';
                playlistId += detailId2ApiId(paths[3]);
                break;
            }
        }

        return {
            vendor,
            playlistId,
        };
    }
}

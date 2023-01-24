import { detailId2ApiId, shareId2ApiId } from '@/utils/flo-utils.js';
import { Vendors } from '@feelin-types/types.js';
import { BadRequestException, Injectable } from '@nestjs/common';
import { URL } from 'url';
import { AppleMusicPlaylistScraper } from './applemusic-playlist-scraper.service.js';
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
        private readonly appleMusicPlaylistScraper: AppleMusicPlaylistScraper,
    ) {
        this.playlistScrapers = {
            melon: melonPlaylistScraper,
            flo: floPlaylistScraper,
            spotify: spotifyPlaylistScraper,
            applemusic: appleMusicPlaylistScraper,
        };
    }

    private readonly SPOTIFY_PLAYLIST_URL_REGEX = /^https:\/\/open\.spotify\.com\/playlist\/([A-Za-z0-9]+)$/;
    private readonly APPLE_MUSIC_PLAYLIST_URL_REGEX =
        /^https:\/\/music\.apple\.com\/[a-zA-Z]{2}\/playlist\/([\w\-]+)\/((pl|p)\.([\w\-]+))$/;
    private readonly MELON_PLAYLIST_SHORT_URL_REGEX = /^https:\/\/kko\.to\/([a-zA-Z0-9]+)$/;
    private readonly MELON_PLAYLIST_REDIRECT_URL_REGEX = /^https:\/\/m2\.melon\.com\/pda\/msvc\/snsGatePage\.jsp$/;
    private readonly MELON_PLAYLIST_URL_REGEX =
        /^https:\/\/www\.melon\.com\/mymusic\/(dj|playlist)\/mymusic(dj)?playlistview_inform\.htm$/;
    private readonly FLO_PLAYLIST_SHORT_URL_REGEX = /^https:\/\/flomuz\.io\/s\/(r|d)\.([a-zA-Z0-9]+)$/;
    private readonly FLO_PLAYLIST_URL_REGEX = /^https:\/\/www\.music-flo\.com\/detail\/(channel|mylist)\/([danielzohy]+)$/;

    get(vendor: Vendors): PlaylistScraper {
        return this.playlistScrapers[vendor];
    }

    async getStreamAndId(playlistUrl: string): Promise<{ vendor: Vendors; playlistId: string }> {
        const playlistUrlWithoutQuery = playlistUrl.split('?')[0];

        if (this.SPOTIFY_PLAYLIST_URL_REGEX.test(playlistUrlWithoutQuery)) {
            const playlistId = playlistUrlWithoutQuery.match(this.SPOTIFY_PLAYLIST_URL_REGEX)[1];
            return { vendor: 'spotify', playlistId };
        }

        if (this.APPLE_MUSIC_PLAYLIST_URL_REGEX.test(playlistUrlWithoutQuery)) {
            const matchResult = playlistUrlWithoutQuery.match(this.APPLE_MUSIC_PLAYLIST_URL_REGEX);
            const type = matchResult[3];
            const playlistId = matchResult[4];
            if (type === 'pl') {
                return { vendor: 'applemusic', playlistId: `catalog:${playlistId}` };
            } else if (type === 'p') {
                return { vendor: 'applemusic', playlistId: `user:${playlistId}` };
            }
        }

        if (this.MELON_PLAYLIST_SHORT_URL_REGEX.test(playlistUrlWithoutQuery)) {
            const res = await fetch(playlistUrl, { redirect: 'manual' });
            const redirectUrl = res.headers.get('location');
            if (!redirectUrl || !this.MELON_PLAYLIST_REDIRECT_URL_REGEX.test(redirectUrl.split('?')[0])) {
                throw new BadRequestException('Melon url malformed');
            }

            const url = new URL(redirectUrl);
            const playlistId = url.searchParams.get('sId');
            if (url.searchParams.get('type') === 'djc') {
                return { vendor: 'melon', playlistId: `catalog:${playlistId}` };
            } else if (url.searchParams.get('type') === 'ply') {
                return { vendor: 'melon', playlistId: `user:${playlistId}` };
            }
        }
        if (this.MELON_PLAYLIST_URL_REGEX.test(playlistUrlWithoutQuery)) {
            const type = playlistUrlWithoutQuery.match(this.MELON_PLAYLIST_URL_REGEX)[1];
            const url = new URL(playlistUrlWithoutQuery);
            const playlistId = url.searchParams.get('plylstSeq');
            if (type === 'dj') {
                return { vendor: 'melon', playlistId: `catalog:${playlistId}` };
            } else if (type === 'playlist') {
                return { vendor: 'melon', playlistId: `user:${playlistId}` };
            }
        }

        if (this.FLO_PLAYLIST_SHORT_URL_REGEX.test(playlistUrlWithoutQuery)) {
            const matchResult = playlistUrlWithoutQuery.match(this.FLO_PLAYLIST_SHORT_URL_REGEX);
            const type = matchResult[1];
            const playlistId = matchResult[2];
            if (type === 'd') {
                return { vendor: 'flo', playlistId: `catalog:${shareId2ApiId(playlistId)}` };
            } else if (type === 'r') {
                return { vendor: 'flo', playlistId: `user:${shareId2ApiId(playlistId)}` };
            }
        }
        if (this.FLO_PLAYLIST_URL_REGEX.test(playlistUrlWithoutQuery)) {
            const matchResult = playlistUrlWithoutQuery.match(this.FLO_PLAYLIST_URL_REGEX);
            const type = matchResult[1];
            const playlistId = matchResult[2];
            if (type === 'channel') {
                return { vendor: 'flo', playlistId: `catalog:${detailId2ApiId(playlistId)}` };
            } else if (type === 'mylist') {
                return { vendor: 'flo', playlistId: `user:${detailId2ApiId(playlistId)}` };
            }
        }
        throw new BadRequestException('Unsupported playlist url type');
    }
}

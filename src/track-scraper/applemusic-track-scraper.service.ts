import { ApplemusicArtistScraper } from '@/artist-scraper/applemusic-artist-scraper.service.js';
import { SearchResults } from '@/track/types/types.js';
import { AlbumInfo, ArtistInfo, TrackInfo } from '@/types/types.js';
import { ApplemusicUserScraper } from '@/user-scraper/applemusic-user-scraper.service.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { chunk } from 'lodash-es';
import { trackUrlsByVendor } from './constants.js';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class AppleMusicTrackScraper implements TrackScraper {
    constructor(
        private readonly applemusicArtistScraper: ApplemusicArtistScraper,
        private readonly applemusicUserScraper: ApplemusicUserScraper,
    ) {}

    private readonly trackUrls = trackUrlsByVendor['applemusic'];
    private readonly albumCoverSize = 300;
    private readonly pageSize = 300;

    async searchTrack(track: TrackInfo): Promise<SearchResults> {
        const authToken = await this.applemusicUserScraper.getAdminToken();
        const response = await axios.get(this.trackUrls.search.replace('{countryCode}', 'us'), {
            params: {
                term: `${track.title}-${track.artistNames}`,
                types: 'songs',
                limit: 25,
                offset: 0,
            },
            headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        });

        const trackList =
            response.data.results?.songs?.data?.map((track) => this.convertToTrackInfo(track, this.albumCoverSize)) ?? [];
        return { isDetailed: false, results: trackList };
    }

    async getMyRecentTracks(authdata: Authdata): Promise<TrackInfo[]> {
        const authToken = await this.applemusicUserScraper.getAdminToken();
        const response = await axios.get(this.trackUrls.recentlyPlayed, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Music-User-Token': authdata.accessToken,
                'Content-Type': 'application/json',
            },
        });

        // TODO: Check if the response is valid
        const recentTrackList = response.data.map((track) => this.convertToTrackInfo(track, this.albumCoverSize));
        return recentTrackList;
    }

    async getTracksByIds(trackIds: string[]): Promise<TrackInfo[]> {
        const authToken = await this.applemusicUserScraper.getAdminToken();
        const trackIdsToRequest = chunk(trackIds, this.pageSize);
        const promiseList = trackIdsToRequest.map((trackIds) =>
            axios.get(this.trackUrls.getTracksByIds.replace('{countryCode}', 'us'), {
                params: { ids: trackIds.join(',') },
                headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
            }),
        );
        const response = (await Promise.all(promiseList)).flatMap((response) => response.data.data);

        const artistIds = response.flatMap((track) => {
            const artistsData = track.relationships.artists.data;
            if (artistsData.length > 1) {
                artistsData.map((artist) => artist.id);
            }
            return [];
        });
        const artistsInfo = await this.applemusicArtistScraper.getArtistsById(artistIds, authToken);
        const artistsNameById = new Map<string, string>(artistsInfo.map((artist) => [artist.id, artist.name]));

        const trackList = response.map((track) => this.convertToTrackInfo(track, this.albumCoverSize, artistsNameById));
        return trackList;
    }

    convertToTrackInfo(track: any, albumCoverSize: number, artistsNameById?: Map<string, string>): TrackInfo {
        const artists: ArtistInfo[] = track?.relationships?.artists?.data?.map((artist) => ({
            id: artist.id,
            name: artistsNameById.get(artist.id) ?? artist.attributes.name,
        }));

        const album: AlbumInfo = {
            id: track?.relationships?.albums?.attributes?.data?.[0]?.id,
            title: track.attributes.albumName,
            coverUrl: this.formatCoverUrl(track.attributes.artwork.url, albumCoverSize),
        };

        return {
            id: track.id,
            title: track.attributes.name,
            duration: track.attributes.durationInMillis,
            artists: artists,
            artistNames: track.attributes.artistName,
            album: album,
            albumTitle: track.attributes.albumName,
        };
    }

    private formatCoverUrl(coverUrlFormat: string, size: number): string {
        return coverUrlFormat.replace('{w}x{h}', `${size}x${size}`);
    }
}

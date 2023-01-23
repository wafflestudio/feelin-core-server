import { SearchResults } from '@/track/types/types.js';
import { AlbumInfo, ArtistInfo, TrackInfo } from '@/types/types.js';
import { SpotifyUserScraper } from '@/user-scraper/spotify-user-scraper.service.js';
import { ImagePickerUtilService } from '@/utils/image-picker-util/image-picker-util.service.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { trackUrlsByVendor } from './constants.js';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class SpotifyTrackScraper implements TrackScraper {
    constructor(private readonly spotifyUserScraper: SpotifyUserScraper) {}

    private readonly trackUrls = trackUrlsByVendor['spotify'];
    private readonly albumCoverSize = 300;

    async searchTrack(track: TrackInfo): Promise<SearchResults> {
        const authToken = await this.spotifyUserScraper.getAdminToken();
        const response = await axios.get(this.trackUrls.search, {
            params: {
                q: track.title,
                type: 'track',
                include_external: 'audio',
                limit: 50,
                offset: 0,
            },
            headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        });

        const trackList = response.data.tracks.items.map((track) => this.covertToTrackInfo(track, this.albumCoverSize));
        return { isDetailed: true, results: trackList };
    }

    async getMyRecentTracks(authdata: Authdata): Promise<TrackInfo[]> {
        const response = await axios.get(this.trackUrls.recentlyPlayed, {
            headers: {
                Authorization: `Bearer ${authdata.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const recentTrackList = response.data.items.map((track) => this.covertToTrackInfo(track, this.albumCoverSize));
        return recentTrackList;
    }

    covertToTrackInfo(track: any, albumCoverSize: number): TrackInfo {
        const artists: ArtistInfo[] = track.artists.map((artist) => ({
            id: artist.id,
            name: artist.name,
        }));
        const album: AlbumInfo = {
            id: track.album.id,
            title: track.album.name,
            coverUrl: ImagePickerUtilService.pickImageOfSize(track.album.images, albumCoverSize),
        };
        return {
            title: track.name,
            id: track.id,
            duration: track.duration_ms,
            artists: artists,
            artistNames: track.artists.map((artist) => artist.name).join(', '),
            album: album,
            albumTitle: album.title,
        };
    }
}

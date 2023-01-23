import { AlbumInfo, ArtistInfo, TrackInfo } from '@/types/types.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { trackUrlsByVendor } from './constants.js';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class AppleMusicTrackScraper implements TrackScraper {
    constructor() {}

    private readonly trackUrls = trackUrlsByVendor['applemusic'];
    private readonly albumCoverSize = 300;

    async searchTrack(track: TrackInfo, authdata: Authdata): Promise<TrackInfo[]> {
        const response = await axios.get(this.trackUrls.search, {
            params: {
                term: track.title,
                types: 'songs',
                limit: 25,
                offset: 0,
            },
            headers: { Authorization: '', 'Content-Type': 'application/json' },
        });

        const trackList = response.data?.map((track) => this.convertToTrackInfo(track, this.albumCoverSize));
        return trackList;
    }

    async getMyRecentTracks(authdata: Authdata): Promise<TrackInfo[]> {
        const response = await axios.get(this.trackUrls.recentlyPlayed, {
            headers: {
                Authorization: '',
                'Music-User-Token': authdata.accessToken,
                'Content-Type': 'application/json',
            },
        });

        // TODO: Check if the response is valid
        const recentTrackList = response.data.map((track) => this.convertToTrackInfo(track, this.albumCoverSize));
        return recentTrackList;
    }

    convertToTrackInfo(track: any, albumCoverSize: number): TrackInfo {
        const artists: ArtistInfo[] = track.relationships.artists.data.map((artist) => ({
            id: artist.id,
            name: artist.attributes.name, // TODO: Artist name is concatenated
        }));

        const album: AlbumInfo = {
            id: track.relationships.albums.attributes.data[0].id,
            title: track.attributes.albumName,
            coverUrl: this.formatCoverUrl(track.attributes.artwork.url, albumCoverSize),
        };

        return {
            id: track.id,
            title: track.attributes.name,
            duration: track.attributes.durationInMillis,
            artists: artists,
            album: album,
        };
    }

    private formatCoverUrl(coverUrlFormat: string, size: number): string {
        return coverUrlFormat.replace('{w}x{h}', `${size}x${size}`);
    }
}

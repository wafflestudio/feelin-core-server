import { AlbumInfo, ArtistInfo, TrackInfo } from '@/types/types.js';
import { ImagePickerUtilService } from '@/utils/image-picker-util/image-picker-util.service.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { trackUrlsByVendor } from './constants.js';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class SpotifyTrackScraper implements TrackScraper {
    constructor() {}

    private readonly trackUrls = trackUrlsByVendor['spotify'];

    async searchTrack(track: TrackInfo, authdata: Authdata): Promise<TrackInfo[]> {
        const response = await axios.get(this.trackUrls.search, {
            params: {
                q: track.title,
                type: 'track',
                include_external: 'audio',
                limit: 50,
                offset: 0,
            },
            headers: {
                Authorization: authdata.accessToken,
                'Content-Type': 'application/json',
            },
        });

        const trackList: TrackInfo[] = response.data?.tracks?.items?.map((track) => {
            const artists: ArtistInfo[] = track?.artists?.map((artist) => ({
                id: artist?.id,
                name: artist?.name,
            }));
            const album: AlbumInfo = {
                title: track?.album?.name,
                id: track?.album?.id,
                coverUrl: track?.album?.images[0]?.url,
            };

            return {
                title: track?.name,
                id: track?.id,
                artists: artists,
                album: album,
            };
        });

        return trackList;
    }

    async getMyRecentTracks(authdata: Authdata): Promise<TrackInfo[]> {
        const response = await axios.get(this.trackUrls.recentlyPlayed, {
            headers: {
                Authorization: authdata.accessToken,
                'Content-Type': 'application/json',
            },
        });

        const recentTrackList: TrackInfo[] = response.data?.items?.map((track) => {
            const artists: ArtistInfo[] = track?.track?.artists?.map((artist) => ({
                id: artist?.id,
                name: artist?.name,
            }));
            const album: AlbumInfo = {
                id: track?.track?.album?.id,
                title: track?.track?.album?.name,
                coverUrl: track?.track?.album?.images[0]?.url,
            };

            return {
                title: track?.track?.name,
                id: track?.track?.id,
                artists: artists,
                album: album,
            };
        });

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
            album: album,
        };
    }
}

import { IPlaylist } from '@/playlist/types/types.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { IAlbum, IArtist, ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import axios from 'axios';
import { playlistUrlsByVendor } from './constants.js';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class SpotifyPlaylistScraper implements PlaylistScraper {
    constructor(private readonly vendorTrackRepository: VendorTrackRepository) {}

    private readonly userUrl: 'https://api.spotify.com/v1/me';
    private readonly playlistUrls = playlistUrlsByVendor['spotify'];

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata) {
        const userData: any = await axios.get(this.userUrl, {
            headers: {
                Authorization: authdata.accessToken,
                'Content-Type': 'application/json',
            },
        });
        const createResponse = await axios.post(
            this.playlistUrls.createPlaylist.replace('{userId}', userData.id),
            {
                name: request.title,
                description: request.description,
            },
            {
                headers: {
                    Authorization: authdata.accessToken,
                    'Content-Type': 'application/json',
                },
            },
        );

        const playlistId = createResponse.data?.id;

        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(
            'spotify',
            tracks.map(({ id }) => id),
        );

        const trackIds = tracks.map(({ id }) => vendorTracks[id]?.vendorId).filter((id) => !!id);
        await axios.post(this.playlistUrls.addTracksToPlaylist.replace('{playlistId}', playlistId), null, {
            params: {
                uris: '' + trackIds.map((id) => 'spotify:track:' + id),
            },
            headers: {
                Authorization: authdata.accessToken,
                'Content-Type': 'application/json',
            },
        });
    }

    async getPlaylist(playlistId: string, authdata: Authdata): Promise<IPlaylist> {
        const res = await axios.get(this.playlistUrls.getPlaylist['user'].replace('{playlistId}', playlistId), {
            headers: {
                Authorization: authdata.accessToken,
                'Content-Type': 'application/json',
            },
        });
        const playlistData = res.data?.items;

        const tracks: ITrack[] = playlistData?.map((item) => {
            const artists: IArtist[] = item?.track?.artists?.map((artist) => ({
                vendor: 'spotify',
                id: artist?.id,
                name: artist?.name,
            }));
            const album: IAlbum = {
                vendor: 'spotify',
                title: item?.track?.album?.name,
                id: item?.track?.album?.id,
                coverUrl: item?.track.album?.images[0]?.url,
            };

            return {
                vendor: 'spotify',
                title: item?.track?.name,
                id: item?.track?.id,
                artists: artists,
                album: album,
            };
        });

        return {
            vendor: 'spotify',
            title: playlistData?.name,
            id: playlistId,
            tracks,
        };
    }

    protected formatCoverUrl(coverUrlFormat: string, size: number): string {
        return coverUrlFormat.replace(/{size}/, `${size}x${size}`);
    }
}

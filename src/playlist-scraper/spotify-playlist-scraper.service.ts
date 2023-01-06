import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, SpotifyAuthdata, SpotifyAuthdataKeys } from '@/authdata/types.js';
import { IPlaylist } from '@/playlist/types/types.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import axios from 'axios';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class SpotifyPlaylistScraper implements PlaylistScraper {
    private readonly playlistUrl = {
        user: 'https://api.spotify.com/v1/me/playlist',
    };

    userUrl: 'https://api.spotify.com/v1/me';

    constructor(
        private readonly authdataService: AuthdataService,
        private readonly vendorTrackRepository: VendorTrackRepository,
    ) {}

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authData: Authdata) {
        const spotifyAuthData = authData as SpotifyAuthdata;
        const userData: any = await axios.get(this.userUrl, {
            headers: {
                Authorization: this.authdataService.toString('spotify', spotifyAuthData),
                'Content-Type': 'application/json',
            },
        });
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${userData.id}/playlists`;
        const createResponse = await axios.post(
            createPlaylistUrl,
            {
                name: request.title,
                description: request.description,
            },
            {
                headers: {
                    Authorization: this.authdataService.toString('spotify', spotifyAuthData),
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
        const addTracksToPlaylistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const addResponse = await axios.post(addTracksToPlaylistUrl, null, {
            params: {
                uris: '' + trackIds.map((id) => 'spotify:track:' + id),
            },
            headers: {
                Authorization: this.authdataService.toString('spotify', spotifyAuthData),
                'Content-Type': 'application/json',
            },
        });
    }

    async getPlaylist(playlistId: string, authData: Authdata): Promise<IPlaylist> {
        const spotifyAuthData = authData as SpotifyAuthdata;
        const playlistItemsUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const res = await axios.get(playlistItemsUrl, {
            headers: {
                Authorization: this.authdataService.toString('spotify', spotifyAuthData),
                'Content-Type': 'application/json',
            },
        });
        const playlistData = res.data?.items;

        const tracks: ITrack[] = playlistData?.map((item: any) => ({
            vendor: 'spotify',
            title: item?.track?.name,
            id: item?.track?.id,
            artists: item?.track?.artists?.map((artist: any) => ({ vendor: 'spotify', id: artist.id, name: artist.name })),
            album: {
                vendor: 'spotify',
                title: item?.track?.album?.name,
                id: item?.track?.album?.id,
                coverUrl: item?.track.album?.images[0].url,
                //coverUrl -> flo playlist response json 구조를 알아야 할 것 같음. 우선은 가장 큰 사이즈의 앨범커버 url으로
            },
        }));

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

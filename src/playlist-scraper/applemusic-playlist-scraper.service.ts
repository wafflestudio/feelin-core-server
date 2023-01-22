import { PlaylistInfo } from '@/playlist/types/types.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { AlbumInfo, ArtistInfo, TrackInfo } from '@feelin-types/types.js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Track } from '@prisma/client';
import axios from 'axios';
import { playlistUrlsByVendor } from './constants.js';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class AppleMusicPlaylistScraper implements PlaylistScraper {
    constructor(private readonly vendorTrackRepository: VendorTrackRepository) {}

    private readonly playlistUrls = playlistUrlsByVendor['applemusic'];

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata) {
        const createResponse = await axios.post(
            this.playlistUrls.createPlaylist,
            {
                attributes: {
                    name: request.title,
                    description: request.description,
                },
            },
            {
                headers: {
                    Authorization: '',
                    'Music-User-Token': authdata.accessToken,
                    'Content-Type': 'application/json',
                },
            },
        );

        const playlistId = createResponse.data[0]?.id;

        const vendorTracks = await this.vendorTrackRepository.findAllWithTrackByIdAndVendor(
            'applemusic',
            tracks.map(({ id }) => id),
        );

        const addTracks = tracks
            .map(({ id }) => vendorTracks[id]?.vendorId)
            .filter((id) => !!id)
            .map((item) => ({ ...item, type: 'songs' }));
        await axios.post(
            this.playlistUrls.addTracksToPlaylist.replace('{playlistId}', playlistId),
            {
                addTracks,
            },
            {
                headers: {
                    Authorization: '',
                    'Music-User-Token': authdata.accessToken,
                    'Content-Type': 'application/json',
                },
            },
        );
    }

    async getPlaylist(id: string, authdata: Authdata): Promise<PlaylistInfo> {
        const [type, playlistId] = id.split(':');
        if (type !== 'user' && type !== 'catalog') {
            throw new InternalServerErrorException('Invalid playlist id');
        }

        // TODO: Change country code
        const res = await axios.get(
            this.playlistUrls.getPlaylist[type].replace('{playlistId}', playlistId).replace('{countryCode}', 'kr'),
            {
                headers: {
                    Authorization: '',
                    'Music-User-Token': authdata.accessToken,
                    'Content-Type': 'application/json',
                },
            },
        );
        const playlistData = res?.data;

        const tracks: TrackInfo[] = playlistData?.map((track) => {
            const artists: ArtistInfo[] = track?.relationships?.artists
                ? track?.relationships?.artists?.data?.map((artist) => ({
                      vendor: 'applemusic',
                      id: artist?.id,
                      name: artist?.attributes?.name,
                  }))
                : [
                      {
                          vendor: 'applemusic',
                          id: track?.attributes?.name, //id를 바로 구해오지 못함. 전체 artists list를 불러와서 하나씩 대조해보는 방법말고는 방법이 없는듯.?
                          name: track?.attributes?.artistName,
                      },
                  ];

            const album: AlbumInfo = {
                title: track?.attributes?.albumName,
                id: track?.attributes?.name, //id not given. 임시로 노래 제목.
                coverUrl: this.formatCoverUrl(
                    track?.attributes?.artwork?.url,
                    track?.attributes?.artwork?.width,
                    track?.attributes?.artwork?.height,
                ),
            };

            return {
                title: track?.attributes?.name,
                id: track?.attributes?.playParams?.catalogId,
                artists: artists,
                album: album,
            };
        });

        return {
            title: res?.data?.attributes?.name,
            id: playlistId,
            coverUrl: '',
            tracks,
        };
    }

    protected formatCoverUrl(coverUrlFormat: string, width: number, height: number): string {
        return coverUrlFormat.replace('{w}x{h}', `${width}x${height}`);
    }
}

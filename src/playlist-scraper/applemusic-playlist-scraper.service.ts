import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, ApplemusicAuthdata } from '@/authdata/types.js';
import { IPlaylist } from '@/playlist/types/types.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { IAlbum, IArtist, ITrack } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';
import axios from 'axios';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class AppleMusicPlaylistScraper implements PlaylistScraper {
    private readonly playlistUrl = {
        user: 'https://api.music.apple.com/v1/me/library/playlists',
    };

    constructor(
        private readonly authdataService: AuthdataService,
        private readonly vendorTrackRepository: VendorTrackRepository,
    ) {}

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authData: Authdata) {
        const applemusicAuthdata = authData as ApplemusicAuthdata;
        const createPlaylistUrl = `https://api.music.apple.com/v1/me/library/playlists`;
        const createResponse = await axios.post(
            createPlaylistUrl,
            {
                attributes: {
                    name: request.title,
                    description: request.description,
                },
            },
            {
                headers: {
                    Authorization: this.authdataService.toString('applemusic', applemusicAuthdata),
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
            .map((item) => ({ ...item, type: 'library-songs' })); //songs, library-songs의 차이....?
        const addTracksToPlaylistUrl = `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`;
        await axios.post(
            addTracksToPlaylistUrl,
            {
                addTracks,
            },
            {
                headers: {
                    Authorization: this.authdataService.toString('applemusic', applemusicAuthdata),
                    'Content-Type': 'application/json',
                },
            },
        );
    }

    async getPlaylist(playlistId: string, authData: Authdata): Promise<IPlaylist> {
        const applemusicAuthdata = authData as ApplemusicAuthdata;
        const playlistItemsUrl = `https://api.music.apple.com/v1/me/library/playlists/${playlistId}`;
        const res = await axios.get(playlistItemsUrl, {
            headers: {
                Authorization: this.authdataService.toString('applemusic', applemusicAuthdata),
                'Content-Type': 'application/json',
            },
        });
        const playlistData = res?.data?.relationships?.tracks?.data;

        const tracks: ITrack[] = playlistData?.map((track) => {
            const artists: IArtist[] = track?.relationships?.artists
                ? track?.relationships?.artists?.data?.map((artist) => ({
                      vendor: 'applemusic',
                      id: artist?.id,
                      name: artist?.attributes?.name,
                  })) //By defalut, relationships.artists is not included -> parameter query 의 types에서 지정해주는 값에 영향을 받는것 or types는 검색하는 객체들 필터링만?
                : [
                      {
                          vendor: 'applemusic',
                          id: track?.attributes?.name, //id를 바로 구해오지 못함. 전체 artists list를 불러와서 하나씩 대조해보는 방법말고는 방법이 없는듯.?
                          name: track?.attributes?.artistName,
                      },
                  ];

            const album: IAlbum = {
                vendor: 'applemusic',
                title: track?.attributes?.albumName,
                id: track?.attributes?.name, //id not given. 임시로 노래 제목.
                coverUrl: this.formatCoverUrl(
                    track?.attributes?.artwork?.url,
                    track?.attributes?.artwork?.width,
                    track?.attributes?.artwork?.height,
                ),
            };

            return {
                vendor: 'applemusic',
                title: track?.attributes?.name,
                id: track?.id,
                artists: artists,
                album: album,
            };
        });

        return {
            vendor: 'applemusic',
            title: res?.data?.attributes?.name,
            id: playlistId,
            tracks,
        };
    }

    protected formatCoverUrl(coverUrlFormat: string, width: number, height: number): string {
        return coverUrlFormat.replace('{w}x{h}', `${width}x${height}`);
    }
}

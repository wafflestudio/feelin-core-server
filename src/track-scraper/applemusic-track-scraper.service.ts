import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, ApplemusicAuthdata } from '@/authdata/types.js';
import { IAlbum, IArtist, ITrack } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TrackScraper } from './track-scraper.js';

@Injectable()
export class AppleMusicTrackScraper implements TrackScraper {
    private readonly searchUrl = 'https://api.music.apple.com/v1/me/library/search';
    private readonly recentTrackUrl = 'https://api.music.apple.com/v1/me/recent/played/tracks';

    constructor(private readonly authdataService: AuthdataService) {}

    async searchTrack(track: ITrack, authData: Authdata): Promise<ITrack[]> {
        const applemusicAuthData = authData as ApplemusicAuthdata;
        const response = await axios.get(this.searchUrl, {
            params: {
                term: track.title,
                types: 'library-songs',
                limit: 25,
                offset: 0,
            },
            headers: {
                Authorization: this.authdataService.toString('applemusic', applemusicAuthData),
                'Content-Type': 'application/json',
            },
        });

        const trackList: ITrack[] = response.data?.map((track) => {
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

        return trackList;
    }

    async getMyRecentTracks(applemusicAuthData: ApplemusicAuthdata): Promise<ITrack[]> {
        const response = await axios.get(this.recentTrackUrl, {
            headers: {
                Authorization: this.authdataService.toString('applemusic', applemusicAuthData),
                'Content-Type': 'application/json',
            },
        });

        const recentTrackList: ITrack[] = response.data?.map((track) => {
            const artists: IArtist[] = track?.relationships?.artists
                ? track?.relationships?.artists?.data?.map((artist) => ({
                      vendor: 'applemusic',
                      id: artist?.id,
                      name: artist?.attributes?.name,
                  }))
                : [
                      {
                          vendor: 'applemusic',
                          id: track?.attributes?.id, //id를 바로 구해오지 못함. 전체 artists list를 불러와서 하나씩 대조해보는 방법말고는 방법이 없는듯.? 우선은 임시로 track의 id로
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

        return recentTrackList;
    }

    protected formatCoverUrl(coverUrlFormat: string, width: number, height: number): string {
        return coverUrlFormat.replace('{w}x{h}', `${width}x${height}`);
    }
}
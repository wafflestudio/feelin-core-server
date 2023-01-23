import { PlaylistInfo, PlaylistType } from '@/playlist/types/types.js';
import { AppleMusicTrackScraper } from '@/track-scraper/applemusic-track-scraper.service.js';
import { VendorTrackRepository } from '@/track/vendor-track.repository.js';
import { SavePlaylistRequestDto } from '@/user/dto/save-playlist-request.dto.js';
import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';
import { TrackInfo } from '@feelin-types/types.js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Track } from '@prisma/client';
import axios from 'axios';
import { playlistUrlsByVendor } from './constants.js';
import { PlaylistScraper } from './playlist-scraper.js';

@Injectable()
export class AppleMusicPlaylistScraper implements PlaylistScraper {
    constructor(
        private readonly applemusicTrackScraper: AppleMusicTrackScraper,
        private readonly vendorTrackRepository: VendorTrackRepository,
    ) {}

    private readonly playlistUrls = playlistUrlsByVendor['applemusic'];
    private readonly albumCoverSize = 300;

    public async savePlaylist(request: SavePlaylistRequestDto, tracks: Track[], authdata: Authdata) {
        const createResponse = await axios.post(
            this.playlistUrls.createPlaylist,
            {
                attributes: {
                    name: request.title,
                    description: request.description,
                },
            },
            { headers: { Authorization: '', 'Music-User-Token': authdata.accessToken, 'Content-Type': 'application/json' } },
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
            { addTracks },
            { headers: { Authorization: '', 'Music-User-Token': authdata.accessToken, 'Content-Type': 'application/json' } },
        );
    }

    async getPlaylist(id: string, authdata: Authdata): Promise<PlaylistInfo> {
        const { type, playlistId } = this.getAppleMusicId(id);
        const headers = { Authorization: '', 'Content-Type': 'application/json' };
        if (type === 'user') {
            headers['Music-User-Token'] = authdata.accessToken;
        }

        const res = await axios.get(
            this.playlistUrls.getPlaylist[type].replace('{playlistId}', playlistId).replace('{countryCode}', 'us'),
            { headers },
        );
        const tracks: TrackInfo[] = res.data.data.map((track) =>
            this.applemusicTrackScraper.convertToTrackInfo(track, this.albumCoverSize),
        );

        return {
            title: res?.data?.attributes?.name,
            id: playlistId,
            coverUrl: '',
            tracks,
        };
    }

    private getAppleMusicId(id: string): { type: PlaylistType; playlistId: string } {
        const [type, playlistId] = id.split(':');

        if (type === 'user') {
            return { type: 'user', playlistId: `p.${playlistId}` };
        } else if (type === 'catalog') {
            return { type: 'catalog', playlistId: `pl.${playlistId}` };
        }
        throw new InternalServerErrorException('Invalid playlist id');
    }

    private formatCoverUrl(coverUrlFormat: string, width: number, height: number): string {
        return coverUrlFormat.replace('{w}x{h}', `${width}x${height}`);
    }
}

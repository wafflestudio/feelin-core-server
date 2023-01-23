import { ArtistInfo } from '@/types/types.js';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { chunk } from 'lodash-es';

@Injectable()
export class ApplemusicArtistScraper {
    constructor() {}

    private readonly pageSize = 30;
    private readonly getArtistsByIdsUrl = 'https://api.music.apple.com/v1/catalog/us/artists';

    async getArtistsById(artistIds: string[], authToken: string): Promise<ArtistInfo[]> {
        const artistIdsToRequest = chunk(artistIds, this.pageSize);
        const promiseList = artistIdsToRequest.map((artistIds) =>
            axios.get(this.getArtistsByIdsUrl, {
                params: { ids: artistIds.join(',') },
                headers: { Authorization: authToken, 'Content-Type': 'application/json' },
            }),
        );

        const response = (await Promise.all(promiseList)).flatMap((response) => response.data.data);
        const artistList = response.map((artist) => this.convertToArtistInfo(artist));
        return artistList;
    }

    private convertToArtistInfo(artist: any): ArtistInfo {
        return {
            id: artist.id,
            name: artist.attributes.name,
        };
    }
}

import { ITrack, Vendors } from '@/types/types.js';

export interface IPlaylist {
    vendor: Vendors;
    title: string;
    id: string;
    tracks: ITrack[];
}

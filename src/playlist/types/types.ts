import { TrackInfo } from '@/types/types.js';

export type PlaylistInfo = {
    title: string;
    id: string;
    coverUrl: string;
    tracks: TrackInfo[];
};

export type PlaylistInfoFirstPage = {
    playlistInfo: PlaylistInfo;
    offsets: number[];
};

export const VendorEnum = [
    'spotify',
    'applemusic',
    'melon',
    'flo',
    // 'genie',
    // 'bugs',
    // 'vibe',
    // 'ytmusic',
] as const;

export type Vendors = typeof VendorEnum[number];

export type AlbumInfo = {
    id: string;
    title: string;
    coverUrl: string;
};

export type ArtistInfo = {
    id: string;
    name: string;
};

export type TrackInfo = {
    id: string;
    title: string;
    duration: number;
    artists: ArtistInfo[];
    album: AlbumInfo;
};

export const VendorEnum = [
    'melon',
    'flo',
    'spotify',
    // 'genie',
    // 'bugs',
    // 'vibe',
    // 'ytmusic',
    'applemusic',
] as const;

export type Vendors = typeof VendorEnum[number];

export interface IAlbum {
    vendor: Vendors;
    coverUrl: string;
    title: string;
    id: string;
}

export interface IArtist {
    vendor: Vendors;
    name: string;
    id: string;
}

export interface ITrack {
    vendor: Vendors;
    title: string;
    id: string;
    artists: IArtist[];
    album: IAlbum;
}

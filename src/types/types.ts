export const StreamServiceEnum: StreamService[] = [
    'melon',
    'flo',
    // 'genie',
    // 'bugs',
    // 'vibe',
    // 'ytmusic',
    // 'spotify',
    // 'applemusic',
];

export type StreamService = 'melon' | 'flo';
// | 'genie'
// | 'bugs'
// | 'vibe'
// | 'ytmusic'
// | 'spotify'
// | 'applemusic';

export interface TrackInfo {
    streamType: StreamService;
    title: string;
    streamId: string;
    artists: string[];
    artistIds: string[];
    album: string;
    albumId: string;
}

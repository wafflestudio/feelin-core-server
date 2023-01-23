import { Vendors } from '@/types/types.js';

export const trackUrlsByVendor: Record<Vendors, TrackUrl> = {
    spotify: {
        search: 'https://api.spotify.com/v1/search',
        recentlyPlayed: 'https://api.spotify.com/v1/me/player/recently-played',
    },
    applemusic: {
        search: 'https://api.music.apple.com/v1/catalog/{countryCode}/search',
        recentlyPlayed: 'https://api.music.apple.com/v1/me/recent/played/tracks',
        getTracksByIds: 'https://api.music.apple.com/v1/catalog/{countryCode}/songs',
    },
    melon: {
        search: 'https://www.melon.com/search/song/index.htm',
        recentlyPlayed: 'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm',
        recentlyPlayedPaged: 'https://www.melon.com/mymusic/recent/mymusicrecentsong_listPaging.htm',
    },
    flo: {
        search: 'https://www.music-flo.com/api/search/v2/search',
        recentlyPlayed: 'https://www.music-flo.com/api/personal/v1/tracks/recentlistened',
    },
};

type TrackUrl = {
    search: string;
    recentlyPlayed: string;
    getTracksByIds?: string;
    recentlyPlayedPaged?: string;
};

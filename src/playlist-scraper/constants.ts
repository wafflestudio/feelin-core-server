import { Vendors } from '@/types/types.js';

export const playlistUrlsByVendor: Record<Vendors, PlaylistUrl> = {
    spotify: {
        createPlaylist: 'https://api.spotify.com/v1/users/{userId}/playlists',
        addTracksToPlaylist: 'https://api.spotify.com/v1/playlists/{playlistId}/tracks',
        getPlaylist: {
            user: 'https://api.spotify.com/v1/playlists/{playlistId}',
        },
        getPlaylistPaged: {
            user: 'https://api.spotify.com/v1/playlists/{playlistId}/tracks',
        },
    },
    applemusic: {
        createPlaylist: 'https://api.music.apple.com/v1/me/library/playlists',
        addTracksToPlaylist: 'https://api.music.apple.com/v1/me/library/playlists/{playlistId}/tracks',
        getPlaylist: {
            user: 'https://api.music.apple.com/v1/me/library/playlists/{playlistId}/tracks',
            catalog: 'https://api.music.apple.com/v1/catalog/{countryCode}/playlists/{playlistId}/tracks',
        },
        getPlaylistPaged: {
            user: 'https://api.music.apple.com/v1/me/library/playlists/{playlistId}/tracks',
            catalog: 'https://api.music.apple.com/v1/catalog/{countryCode}/playlists/{playlistId}/tracks',
        },
    },
    melon: {
        createPlaylist: 'https://www.melon.com/mymusic/playlist/mymusicplaylistinsert_insertAction.json',
        getPlaylist: {
            user: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_listSong.htm',
            catalog: 'https://www.melon.com/mymusic/dj/mymusicdjplaylistview_inform.htm',
        },
        getPlaylistPaged: {
            user: 'https://www.melon.com/mymusic/playlist/mymusicplaylistview_listSong.htm',
            catalog: 'https://www.melon.com/dj/playlist/djplaylist_listsong.htm',
        },
    },
    flo: {
        createPlaylist: 'https://www.music-flo.com/api/personal/v1/myplaylist',
        addTracksToPlaylist: 'https://www.music-flo.com/api/personal/v1/myplaylist/{playlistId}/track',
        getPlaylist: {
            user: 'https://api.music-flo.com/personal/v1/playlist',
            catalog: 'https://api.music-flo.com/meta/v1/channel',
        },
    },
};

type PlaylistUrl = {
    createPlaylist: string;
    addTracksToPlaylist?: string;
    getPlaylist: {
        user: string;
        catalog?: string;
    };
    getPlaylistPaged?: {
        user: string;
        catalog?: string;
    };
};

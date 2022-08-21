import { Album } from '@/album/album.entity.js';
import { StreamAlbum } from '@/album/streamAlbum.entity.js';
import { Artist } from '@/artist/artist.entity.js';
import { StreamArtist } from '@/artist/streamArtist.entity.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, FloAuthdata } from '@/authdata/types.js';
import { Playlist } from '@/playlist/playlist.entity.js';
import { StreamPlaylist } from '@/playlist/streamPlaylist.entity.js';
import { StreamTrack } from '@/track/streamTrack.entity.js';
import { Track } from '@/track/track.entity.js';
import { TrackService } from '@/track/track.service.js';
import { Injectable } from '@nestjs/common';
import { convDate } from '@utils/floUtils.js';
import axios from 'axios';
import { PlaylistScraper } from './PlaylistScraper.js';

@Injectable()
export class FloPlaylistScraper implements PlaylistScraper {
    private readonly playlistUrl = {
        user: 'https://api.music-flo.com/personal/v1/playlist/',
        dj: 'https://api.music-flo.com/meta/v1/channel/',
    };
    private readonly createPlaylistUrl = 'https://www.music-flo.com/api/personal/v1/myplaylist';

    constructor(protected readonly authdataService: AuthdataService, protected readonly trackService: TrackService) {}

    async getPlaylist(playlistId: string): Promise<Playlist> {
        const [type, id] = playlistId.split(':');
        if (type != 'user' && type != 'dj') {
            // FIXME: Better error message
            throw new Error('Not supported playlist type');
        }
        const res = await axios.get(this.playlistUrl[type] + id).catch((error) => {
            // FIXME: Better error message
            if (error.response) {
                throw new Error('error while making request');
            } else if (error.request) {
                throw new Error('error while making request');
            } else {
                throw new Error('error while making request');
            }
        });

        const playlistData = res.data?.data;
        const floPlaylist = new StreamPlaylist();
        floPlaylist.streamType = 'flo';
        floPlaylist.streamId = playlistId;

        const playlist = new Playlist();
        playlist.title = playlistData?.name;

        let trackList;
        if (type == 'user') {
            trackList = playlistData?.track?.list;
        } else if (type == 'dj') {
            trackList = playlistData?.trackList;
        }

        const tracks = trackList?.map((trackData) => {
            // Track entity
            const streamTrack = new StreamTrack();
            streamTrack.streamType = 'flo';
            streamTrack.streamId = trackData?.id;

            const track = new Track();
            track.title = trackData?.name;

            // Album entity
            const albumData = trackData?.album;
            const streamAlbum = new StreamAlbum();
            streamAlbum.streamId = albumData?.id;
            streamAlbum.streamType = 'flo';

            const album = new Album();
            album.title = albumData?.title;
            album.realeaseDate = convDate(albumData?.releaseYmd);

            // Artists entity
            const artistsData = trackData?.artistList;
            const artists = artistsData?.map((artistData) => {
                const streamArtist = new StreamArtist();
                streamArtist.streamId = artistData?.id;
                streamArtist.streamType = 'flo';

                const artist = new Artist();
                artist.name = artistData?.name;
                return artist;
            });

            track.album = album;
            track.artists = artists;
            return track;
        });

        playlist.tracks = tracks;
        return playlist;
    }

    public async savePlaylist(playlist: Playlist, authData: Authdata) {
        const floAuthData = authData as FloAuthdata;
        const createResponse = await axios.post(
            this.createPlaylistUrl,
            {
                memberChannelName: playlist.title,
            },
            {
                headers: {
                    Cookie: this.authdataService.toString('flo', floAuthData),
                    'x-gm-access-token': floAuthData.accessToken,
                },
            },
        );
        if (createResponse.data?.code !== '2000000') {
            return null;
        }

        const playlistId = createResponse.data?.data?.id;
        const streamTracks = await this.trackService.findAllStreamTracks(playlist.tracks);
        const trackIds = playlist.tracks
            .map(
                (track) =>
                    streamTracks.find((streamTrack) => streamTrack.track === track && streamTrack.streamType === 'flo')
                        ?.streamId,
            )
            .filter((id) => id !== null); // Filter out un-found tracks

        const addResponse = await axios.post(
            this.createPlaylistUrl + `/${playlistId}/tracks`,
            {
                trackIdList: trackIds,
            },
            {
                headers: {
                    Cookie: this.authdataService.toString('flo', floAuthData),
                    'x-gm-access-token': floAuthData.accessToken,
                },
            },
        );
        if (addResponse.data?.code !== '2000000') {
            return null;
        }
    }
}

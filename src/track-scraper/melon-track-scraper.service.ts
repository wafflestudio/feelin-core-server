import { Album } from '@/album/album.entity.js';
import { StreamAlbum } from '@/album/streamAlbum.entity.js';
import { Artist } from '@/artist/artist.entity.js';
import { StreamArtist } from '@/artist/streamArtist.entity.js';
import { AuthdataService } from '@/authdata/authdata.service.js';
import { Authdata, MelonAuthdata } from '@/authdata/types.js';
import { StreamTrack } from '@/track/streamTrack.entity.js';
import { Track } from '@/track/track.entity.js';
import { convDate } from '@/utils/floUtils.js';
import { TrackInfo } from '@feelin-types/types.js';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import randomUseragent from 'random-useragent';
import { TrackScraper } from './TrackScraper.js';

@Injectable()
export class MelonTrackScraper implements TrackScraper {
    private readonly recentTrackUrl = 'https://www.melon.com/mymusic/recent/mymusicrecentsong_list.htm';
    private readonly recentTrackListUrl = 'https://www.melon.com/mymusic/recent/mymusicrecentsong_listPaging.htm';
    private readonly trackInfoUrl = 'https://m2.melon.com/m6/v2/song/info.json';
    private readonly melonURL = 'https://www.melon.com/search/song/index.htm';
    private readonly pageSize = 50;

    constructor(protected readonly authdataService: AuthdataService) {}

    async searchTrack(track: TrackInfo): Promise<TrackInfo[]> {
        // Melon search API limits max 50 results at once
        const response = await axios.get(this.melonURL, {
            params: {
                startIndex: 1,
                pageSize: 50,
                q: track.title,
                sort: 'weight',
                section: 'song',
            },
            headers: {
                'User-Agent': randomUseragent.getRandom(),
            },
        });
        const $ = cheerio.load(response.data);
        const trackList: TrackInfo[] = [];
        $('table > tbody > tr').each((_, el) => {
            trackList.push(this.scrapeTrack($, el));
        });

        return trackList;
    }

    async getTrack(trackId: string): Promise<Track> {
        const res = await axios.get(this.trackInfoUrl, {
            params: {
                songId: trackId,
            },
        });

        const trackData = res.data?.response?.SONGINFO;
        const streamTrack = new StreamTrack();
        streamTrack.streamId = trackData?.SONGID;
        streamTrack.streamType = 'melon';

        // Track
        const track = new Track();
        track.title = trackData?.SONGNAME;

        const albumData = res.data?.response?.ALBUMINFO;
        const streamAlbum = new StreamAlbum();
        streamAlbum.streamId = albumData?.ALBUMID;
        streamAlbum.streamType = 'melon';

        // Album
        const album = new Album();
        album.title = albumData?.ALBUMNAME;
        album.realeaseDate = convDate(albumData?.ISSUEDATE);

        const streamAlbumArtist = new StreamArtist();
        streamAlbumArtist.streamId = albumData?.ARTISTLIST[0]?.ARTISTID;
        streamAlbumArtist.streamType = 'melon';

        const albumArtist = new Artist();
        albumArtist.name = albumData?.ARTISTLIST[0]?.ARTISTNAME;
        album.artist = albumArtist;

        // Artists
        const artists = trackData?.ARTISTLIST?.map((artistData) => {
            const streamArtist = new StreamArtist();
            streamArtist.streamId = artistData?.ARTISTID;
            streamArtist.streamType = 'melon';

            const artist = new Artist();
            artist.name = artistData?.ARTISTNAME;
            return artist;
        });

        track.artists = artists;
        track.album = album;

        return track;
    }

    scrapeMyMusicTrack($: cheerio.Root, el: cheerio.Element): TrackInfo {
        const TRACK_NODE = 0;
        const ARTIST_NODE = 1;
        const ALBUM_NODE = 2;

        let title: string;
        let streamId: string;
        const artists: string[] = [];
        const artistIds: string[] = [];
        let album: string;
        let albumId: string;

        $(el)
            .find('td.t_left > div.wrap > div.ellipsis')
            .each((index, el) => {
                switch (index) {
                    case TRACK_NODE: {
                        streamId = $(el)
                            .find('a.btn')
                            .attr('href')
                            .match(/\(\'(\w+)\'\)/)[1];
                        title = $(el).find('a').last().text();
                        break;
                    }
                    case ARTIST_NODE: {
                        $(el)
                            .find('span > a')
                            .each((j, el) => {
                                const artistId: string = $(el)
                                    .attr('href')
                                    .match(/\(\'(\w+)\'\)/)[1];
                                const artist: string = $(el).text();
                                artists.push(artist);
                                artistIds.push(artistId);
                            });
                        break;
                    }
                    case ALBUM_NODE: {
                        albumId = $(el)
                            .find('a')
                            .attr('href')
                            .match(/\(\'(\w+)\'\)/)[1];
                        album = $(el).find('a').text();
                        break;
                    }
                }
            });

        return {
            streamType: 'melon',
            title,
            streamId,
            artists,
            artistIds,
            album,
            albumId,
        };
    }

    scrapeTrack($: cheerio.Root, el: cheerio.Element): TrackInfo {
        const TITLE_NODE = 0;
        const ARTIST_NODE = 1;
        const ALBUM_NODE = 2;

        let title: string;
        let trackId: string;
        const artists: string[] = [];
        const artistIds: string[] = [];
        let album: string;
        let albumId: string;

        $(el)
            .find('td.t_left > div.wrap > div.ellipsis')
            .each((index, el) => {
                switch (index) {
                    case TITLE_NODE: {
                        trackId = $(el)
                            .find('a.btn')
                            .attr('href')
                            .match(/\(\'(\w+)\'\)/)[1];
                        title = $(el).find('a.fc_gray').last().text();
                        break;
                    }
                    case ARTIST_NODE: {
                        $(el)
                            .find('span > a')
                            .each((_, el) => {
                                const artistId = $(el)
                                    .attr('href')
                                    .match(/\(\'(\w+)\'\)/)[1];
                                const artist: string = $(el).text();

                                artists.push(artist);
                                artistIds.push(artistId);
                            });
                        break;
                    }
                    case ALBUM_NODE: {
                        albumId = $(el)
                            .find('a')
                            .attr('href')
                            .match(/\(\'(\w+)\'\)/)[1];
                        album = $(el).find('a').text();
                        break;
                    }
                }
            });

        return {
            streamType: 'melon',
            title,
            streamId: trackId,
            artists,
            artistIds,
            album,
            albumId,
        };
    }

    async getMyRecentTracks(authdata: Authdata) {
        const melonAuthdata = authdata as MelonAuthdata;

        const { count, recentTracks } = await this.getFirstRecentTracks(melonAuthdata);
        const requestArr: Promise<AxiosResponse<any, any>>[] = [];
        for (let i = 1; i < Math.ceil(count / this.pageSize); i++) {
            requestArr.push(
                axios.get(this.recentTrackListUrl, {
                    params: {
                        startIndex: i * this.pageSize + 1,
                        pageSize: this.pageSize,
                        memberKey: melonAuthdata['keyCookie'],
                    },
                    headers: {
                        Cookie: this.authdataService.toString('melon', melonAuthdata),
                        Referer: `${this.recentTrackUrl}?memberKey=${melonAuthdata['keyCookie']}`,
                    },
                }),
            );
        }
        await axios.all(requestArr).then((responses) => {
            for (const response of responses) {
                const $ = cheerio.load(response.data);
                $('table > tbody > tr').each((_, el) => {
                    recentTracks.push(this.scrapeMyMusicTrack($, el));
                });
            }
        });

        return recentTracks;
    }

    async getFirstRecentTracks(melonAuthdata: MelonAuthdata): Promise<{
        count: number;
        recentTracks: TrackInfo[];
    }> {
        const response = await axios.get(this.recentTrackUrl, {
            params: {
                memberKey: melonAuthdata['keyCookie'],
            },
            headers: {
                Cookie: this.authdataService.toString('melon', melonAuthdata),
            },
        });
        const $ = cheerio.load(response.data);
        const count = $('#conts > div.wrab_list_info > div > span > span').text();

        const recentTracks: TrackInfo[] = [];
        $('table > tbody > tr').each((_, el) => {
            recentTracks.push(this.scrapeMyMusicTrack($, el));
        });

        return {
            count: parseInt(count, 10),
            recentTracks,
        };
    }
}

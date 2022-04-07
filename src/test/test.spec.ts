import { Test, TestingModule } from '@nestjs/testing';
import { getStreamAndId } from 'src/playlist/functions';
import getPlaylist from 'src/playlist/functions/melon/getPlaylistAPI';
import { shareId2ApiId } from 'src/utils/floUtils';

describe('JustTesting', () => {
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule(
            {},
        ).compile();
    });

    it('should get playlist', async () => {
        let playlist = await getPlaylist('dj:457528999');
        console.log(playlist.title);
        console.log(playlist.streamPlaylists);
        console.log(playlist.tracks);
    });

    it('should get response', async () => {
        expect(await getStreamAndId('http://kko.to/xC8slFyEm')).toStrictEqual({
            streamType: 'melon',
            playlistId: 'dj:401498949',
        });
        expect(await getStreamAndId('http://kko.to/MrQGxkbTw')).toStrictEqual({
            streamType: 'melon',
            playlistId: 'user:507021580',
        });
    });

    it('should throw error', async () => {
        try {
            console.log(await getStreamAndId('http://kko.to/0AC7O1NFQ'));
        } catch (e) {
            expect(e.message).toBe('not playlist link');
        }
    });

    it('should convert id', () => {
        expect(shareId2ApiId('hHuGVFRC5')).toBe('1645760044104485');
    });
});

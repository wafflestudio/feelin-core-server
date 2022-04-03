import { StreamService } from 'src/types';
import { URL } from 'url';
// TODO: Better import scheme
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function getStreamAndId(playlistUrl: string): Promise<{
    streamType: StreamService;
    playlistId: string;
}> {
    let url = new URL(playlistUrl);
    const host = url.host;
    let streamType: StreamService;
    let playlistId: string;
    switch (host) {
        // Melon
        // TODO: Better error message
        case 'kko.to': {
            streamType = 'melon';
            let paths = url.pathname.split('/');
            if (!(paths.length === 2 && paths[0] === '')) {
                throw new Error('Melon url malformed');
            }

            const res = await fetch(url.toString(), {
                redirect: 'manual',
            });
            const redirectUrl = res.headers.get('location');
            if (!redirectUrl) {
                throw new Error('Melon url malformed');
            }

            url = new URL(redirectUrl);
            if (url.host !== 'm2.melon.com') {
                throw new Error('Melon url malformed');
            }

            paths = url.pathname.split('/');
            if (
                !(
                    paths.length === 4 &&
                    paths[0] === '' &&
                    paths[1] === 'pda' &&
                    paths[2] === 'msvc' &&
                    paths[3] === 'snsGatePage.jsp'
                )
            ) {
                throw new Error('Melon url malformed');
            }

            if (url.searchParams.get('type') === 'djc') {
                playlistId += 'dj:';
            } else if (url.searchParams.get('type') === 'ply') {
                playlistId += 'my:';
            }

            if (url.searchParams.get('sId')) {
                playlistId += url.searchParams.get('sId');
            }
            break;
        }

        case 'm2.melon.com': {
            // TODO: Mobile web (low priority)
        }

        case 'www.melon.com': {
            streamType = 'melon';
            const paths = url.pathname.split('/');
            if (
                !(
                    paths.length === 4 &&
                    paths[0] === '' &&
                    paths[1] === 'mymusic'
                )
            ) {
                throw new Error('Melon url malformed');
            }

            if (
                paths[2] === 'playlist' &&
                paths[3] === 'mymusicplaylistview_inform.htm'
            ) {
                playlistId += 'my:';
            } else if (
                paths[2] === 'dj' &&
                paths[3] === 'mymusicdjplaylistview_inform.htm'
            ) {
                playlistId += 'dj:';
            } else {
                throw new Error('Melon url malformed');
            }

            if (url.searchParams.get('plystSeq')) {
                playlistId += url.searchParams.get('plystSeq');
            } else {
                throw new Error('Melon url malformed');
            }
            break;
        }

        // Flo
        // http://flomuz.io/s/r.hABnN1Sr4
    }
    return {
        streamType,
        playlistId,
    };
}

export default getStreamAndId;

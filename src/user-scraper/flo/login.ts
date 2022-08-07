import axios from 'axios';
import { FloAuthdata } from '@authdata/types';

const loginUrl = 'https://www.music-flo.com/api/auth/v3/sign/in';

async function login(
    id: string,
    password: string,
): Promise<FloAuthdata | null> {
    const res = await axios.post(
        loginUrl,
        {
            memberId: id,
            memberPwd: password,
            signInType: 'IDM', // Flo native signin
            requestChannelType: 'WEB', // Web login
        },
        {
            headers: {
                Referer: 'https://www.music-flo.com/member/signin',
                'x-gm-device-id': '.',
            },
        },
    );
    if (res.data?.code !== '2000000') {
        return null;
    }

    const { accessToken, refreshToken } = res.data?.data || {};
    if (accessToken === undefined || refreshToken === undefined) {
        return null;
    }

    return { accessToken, refreshToken };
}

export default login;

import axios from 'axios';
import { JwtTokenPair } from 'src/types';

const loginUrl = 'https://www.music-flo.com/api/auth/v3/sign/in';

async function login(
    id: string,
    password: string,
): Promise<JwtTokenPair | null> {
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

    return new JwtTokenPair(accessToken, refreshToken);
}

export default login;

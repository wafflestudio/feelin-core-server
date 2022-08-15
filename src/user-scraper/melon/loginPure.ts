/*
    Login using pure HTTP requests
    Currently NOT working
    -> I suppose melon's RSA algorithm is a bit different with node-rsa's algorithm?
    TODO: Fix problem
*/

import axios from 'axios';
import NodeRSA from 'node-rsa';

interface publicKeyResponse {
    publickey: string;
    exponent: string;
}

interface publicKeyConfig {
    config: {
        n: Buffer;
        e: number;
    };
    publicKey: string;
}

const RSAPublicKeyUrl =
    'https://member.melon.com/muid/web/authentication/authentication_getRSAPublic.json';
const loginUrl =
    'https://member.melon.com/muid/web/login/login_informProcs.htm';

function getCookieString(): string {
    const cookies: string[] = [];
    let PCID = '';
    const length = 10;
    const n = [];
    for (let j = 0; j < length; j++) {
        n[j] = '' + Math.random();
    }

    PCID += new Date().getTime();
    for (let j = 0; j < length; j++) {
        PCID += n[j].charAt(2);
    }
    cookies.push('PCID=' + PCID);
    cookies.push('PC_PCID=' + PCID);

    return cookies.join('; ');
}

async function getPublicKey(cookie: string): Promise<publicKeyConfig> {
    const response = await axios.post(
        RSAPublicKeyUrl,
        {},
        {
            headers: {
                Cookie: cookie,
                Connection: 'keep-alive',
            },
            withCredentials: true,
        },
    );
    const data: publicKeyResponse = response.data;
    return {
        config: {
            n: Buffer.from(data.publickey, 'hex'),
            e: parseInt(data.exponent, 16),
        },
        publicKey: data.publickey,
    };
}

async function login(id: string, password: string) {
    const re = /[\s]+/;
    if (re.test(id) || re.test(password)) {
        console.error('There is a spacing');
        return;
    }

    const cookie = getCookieString();
    const publicKey = await getPublicKey(cookie);
    const key = new NodeRSA();
    key.importKey(publicKey.config, 'components-public');

    const encryptedId = key.encrypt(id, 'hex');
    const encryptedPwd = key.encrypt(password, 'hex');
    const data = {
        saveID: 'N',
        returnPage: 'https://www.melon.com/',
        reqProtocol: '',
        reqType: '',
        memberId: encryptedId,
        memberPwd: encryptedPwd,
        publicKey: publicKey.publicKey,
        reToken: '',
    };
    try {
        const response = await axios.post(
            loginUrl,
            new URLSearchParams(data).toString(),
            {
                headers: {
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    Cookie: cookie,
                    Connection: 'keep-alive',
                    Host: 'member.melon.com',
                    Origin: 'https://member.melon.com',
                    Referer:
                        'https://member.melon.com/muid/web/login/login_informM.htm',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
                },
                withCredentials: true,
            },
        );
        console.log(response.config);
    } catch (error) {
        console.error(error);
        console.log(publicKey);
    }
}

// export login;

import { Protocol } from 'puppeteer';

class CookieData {
    static cookieList = [
        'MAC',
        'MUG',
        'MHC',
        'MUAC',
        'MUNIK',
        'MLCP',
        'MUS',
        'keyCookie',
    ];

    private data = {};

    constructor(data: Protocol.Network.Cookie[] | string) {
        if (Array.isArray(data)) {
            data.filter((cookie) => {
                return CookieData.cookieList.includes(cookie.name);
            }).map((cookie) => {
                this.data[cookie.name] = cookie.value;
            });
        } else if (typeof data === 'string') {
            const cookies = data.split('; ');
            for (let cookie of cookies) {
                const splitCookie = cookie.split('=');
                if (splitCookie.length != 2) {
                    console.error('wrong cookie format');
                }
                const [key, value] = splitCookie;
                this.data[key] = value;
            }
        }
    }

    static fromCookie(data: Protocol.Network.Cookie[]) {
        return new CookieData(data);
    }

    static fromString(data: string) {
        return new CookieData(data);
    }

    toString(): string {
        let cookies = [];
        for (let key of Object.keys(this.data)) {
            if (this.data[key] && CookieData.cookieList.includes(key)) {
                cookies.push(`${key}=${this.data[key]}`);
            }
        }
        return cookies.join('; ');
    }

    getCookie(name: string) {
        return this.data[name];
    }
}

export default CookieData;

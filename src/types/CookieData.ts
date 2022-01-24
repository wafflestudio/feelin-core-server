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

    private data: {
        MAC?: string;
        MUG?: string;
        MHC?: string;
        MUAC?: string;
        MUNIK?: string;
        MLCP?: string;
        MUS?: string;
        keyCookie?: string;
    };

    constructor(data: Array<Protocol.Network.Cookie>) {
        this.data = {};
        data.filter((cookie) => {
            return CookieData.cookieList.includes(cookie.name);
        }).map((cookie) => {
            this.data[cookie.name] = cookie.value;
        });
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

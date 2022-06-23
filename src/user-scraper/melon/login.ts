/*
    Use puppeteer to access user's account
*/

import puppeteer from 'puppeteer';
import { CookieData } from 'src/types';

const responseUrl =
    'https://member.melon.com/muid/web/login/login_informProcs.htm';
const loginUrl = 'https://member.melon.com/muid/web/login/login_informM.htm';

async function login(id: string, password: string): Promise<CookieData | null> {
    let loginSuccess = false;
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    await page.goto(loginUrl, { waitUntil: 'networkidle2' });

    await page.waitForSelector('input[name=id]');
    await page.$eval(
        'input[name=id]',
        (el, value: string) => {
            (el as HTMLInputElement).value = value;
        },
        id,
    );
    await page.waitForSelector('input[name=pwd]');
    await page.$eval(
        'input[name=pwd]',
        (el, value: string) => {
            (el as HTMLInputElement).value = value;
        },
        password,
    );
    await page.waitForSelector('button#btnLogin');
    page.click('button#btnLogin');

    await page.waitForResponse((response) => {
        if (response.url() === responseUrl) {
            if (response.headers()['set-cookie']) {
                loginSuccess = true;
            }
        }
        return response.url() === responseUrl;
    });

    const cookies = await page.cookies();
    await browser.close();

    if (loginSuccess) {
        const cookie = new CookieData(cookies);
        return cookie;
    } else {
        return null;
    }
}

export default login;

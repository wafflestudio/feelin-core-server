import { Injectable } from '@nestjs/common';
import { UserScraper } from './user-scraper.js';
import puppeteer from 'puppeteer';
import { MelonAuthdata } from '@/authdata/types.js';

@Injectable()
export class MelonUserScraper implements UserScraper {
    private readonly responseUrl = 'https://member.melon.com/muid/web/login/login_informProcs.htm';
    private readonly loginUrl = 'https://member.melon.com/muid/web/login/login_informM.htm';

    async login(id: string, password: string): Promise<MelonAuthdata | null> {
        let loginSuccess = false;
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(this.loginUrl, { waitUntil: 'networkidle2' });

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
            if (response.url() === this.responseUrl) {
                if (response.headers()['set-cookie']) {
                    loginSuccess = true;
                }
            }
            return response.url() === this.responseUrl;
        });

        const cookies = await page.cookies();
        console.log(cookies);
        await browser.close();

        if (loginSuccess) {
            const cookie = {} as MelonAuthdata;
            return cookie;
        } else {
            return null;
        }
    }
}

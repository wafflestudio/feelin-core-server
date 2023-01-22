import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieUtilService {
    getValue(cookieString: string, key: string): string {
        const cookies = cookieString.split(';');
        for (const cookie of cookies) {
            const [cookieKey, cookieValue] = cookie.trim().split('=');
            if (cookieKey === key) {
                return cookieValue;
            }
        }
        return null;
    }
}

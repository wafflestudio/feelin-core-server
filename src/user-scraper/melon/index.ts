import { Injectable } from '@nestjs/common';
import { Authdata } from '@authdata/types.js';
import UserScraper from '../UserScraper.js';
import login from './login.js';

@Injectable()
class MelonUserScraper implements UserScraper {
    async login(id: string, password: string): Promise<Authdata | null> {
        return login(id, password);
    }
}

export default MelonUserScraper;

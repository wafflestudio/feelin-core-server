import { Injectable } from '@nestjs/common';
import { AuthData } from 'src/types';
import UserScraper from '../UserScraper';
import login from './login';

@Injectable()
class MelonUserScraper extends UserScraper {
    async login(id: string, password: string): Promise<AuthData | null> {
        return login(id, password);
    }
}

export default MelonUserScraper;

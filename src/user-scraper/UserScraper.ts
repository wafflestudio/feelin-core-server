import { Authdata } from '@/authdata/types.js';

export interface UserScraper {
    login(id: string, password: string): Promise<Authdata | null>;
}

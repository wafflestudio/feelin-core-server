import { Authdata } from '@/authdata/types';

export interface UserScraper {
    login(id: string, password: string): Promise<Authdata | null>;
}

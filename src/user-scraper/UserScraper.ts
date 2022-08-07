import { Authdata } from '@authdata/types';

export default interface UserScraper {
    login(id: string, password: string): Promise<Authdata | null>;
}

import { Authdata } from '@/vendor-account/dto/decrypted-vendor-account.dto.js';

export interface UserScraper {
    login(id: string, password: string): Promise<Authdata | null>;
}

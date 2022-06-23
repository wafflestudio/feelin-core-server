import { AuthData } from 'src/types';

abstract class UserScraper {
    async login(id: string, password: string): Promise<AuthData | null> {
        return null;
    }
}

export default UserScraper;

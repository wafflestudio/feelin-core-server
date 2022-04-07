import { AuthData } from 'src/types';

abstract class UserManager {
    async login(id: string, password: string): Promise<AuthData | null> {
        return null;
    }
}

export default UserManager;

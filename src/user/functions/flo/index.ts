import { AuthData } from 'src/types';
import UserManager from '../UserManager';
import login from './login';

class FloUserManager extends UserManager {
    async login(id: string, password: string): Promise<AuthData | null> {
        return login(id, password);
    }
}

export default FloUserManager;

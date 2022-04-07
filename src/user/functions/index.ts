import { StreamService } from 'src/types';
import FloUserManager from './flo';
import MelonUserManager from './melon';
import UserManager from './UserManager';

const UserManagers: { [key in StreamService]: UserManager } = {
    melon: new MelonUserManager(),
    flo: new FloUserManager(),
};

export default UserManagers;

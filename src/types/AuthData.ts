import { StreamService } from './StreamService';

abstract class AuthData {
    toString(streamType: StreamService): string {
        return '';
    }
}

export default AuthData;

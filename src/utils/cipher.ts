import {
    createCipheriv,
    createDecipheriv,
    generateKeyPair,
    privateDecrypt,
    publicEncrypt,
    randomBytes,
} from 'crypto';
import { promisify } from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);
const IV_LENGTH = 16;

const asymmEncrypt = async (
    data: string,
): Promise<{
    data: string;
    publicKey: string;
    privateKey: string;
}> => {
    const keyPair = await generateKeyPairAsync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: process.env.CRYPTO_PASS,
        },
    });

    const encText = publicEncrypt(
        keyPair.publicKey,
        Buffer.from(data),
    ).toString('base64');

    return {
        data: encText,
        ...keyPair,
    };
};

const asymmDecrypt = async (data: string, key: string): Promise<string> => {
    return privateDecrypt(key, Buffer.from(data)).toString('base64');
};

const symmEncrypt = async (
    data: string,
): Promise<{
    data: string;
    key: string;
}> => {
    const key = randomBytes(32).toString('hex');
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    const encText = cipher.update(data);
    return {
        data:
            iv.toString('hex') +
            ':' +
            Buffer.concat([encText, cipher.final()]).toString('hex'),
        key,
    };
};

const symmDecrypt = async (data: string, key: string): Promise<string> => {
    const textParts = data.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    const decrypted = decipher.update(encryptedText);

    return Buffer.concat([decrypted, decipher.final()]).toString();
};

export { asymmEncrypt, asymmDecrypt, symmEncrypt, symmDecrypt };
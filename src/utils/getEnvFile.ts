export function getEnvFile(): string {
    const ENV: string = process.env.NODE_ENV ?? 'dev';
    if (ENV === 'production') {
        return '.prod.env';
    } else if (ENV === 'test') {
        return '.test.env';
    }
    return '.dev.env';
}

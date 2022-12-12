export function getEnvFile(): string {
    const ENV: string = process.env.NODE_ENV ?? 'dev';
    if (ENV === 'production') {
        return '.env.prod';
    } else if (ENV === 'test') {
        return '.env.test';
    }
    return '.env.dev';
}

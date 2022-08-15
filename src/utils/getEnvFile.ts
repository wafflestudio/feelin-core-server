export default function getEnvFile(): string {
    const ENV: string = process.env.NODE_ENV ?? 'dev';
    let envFile: string;
    if (ENV === 'production') {
        envFile = '.prod.env';
    } else if (ENV == 'test') {
        envFile = '.test.env';
    } else {
        envFile = '.dev.env';
    }

    return envFile;
}

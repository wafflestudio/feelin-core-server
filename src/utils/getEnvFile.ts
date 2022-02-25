const getEnvFile = (): string => {
    const ENV: string = process.env.NODE_ENV ?? 'dev';
    let envFile: string;
    if (ENV === 'production') {
        envFile = '.prod.env';
    } else {
        envFile = '.dev.env';
    }

    return envFile;
};

export default getEnvFile;

import { config } from 'dotenv';
import * as path from 'path';
import { getEnvFile } from 'src/utils';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const envFile = getEnvFile();
config({ path: path.resolve(process.cwd(), envFile) });

const ormConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    migrations: ['dist/migration/*.js'],
    migrationsRun: true,
    cli: {
        migrationsDir: 'src/migration',
    },
};

export default ormConfig;

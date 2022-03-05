import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import getEnvFile from './getEnvFile';

const testUtilModule = () => [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: [getEnvFile()],
    }),
    TypeOrmModule.forRoot({
        type: 'mysql',
        port: +(process.env.DB_PORT ?? 3306),
        username: process.env.DB_USER,
        password: process.env.DB_PWD,
        database: process.env.DB_NAME,
        entities: ['src/../**/*.entity{.ts,.js}'],
        synchronize: true,
        migrations: ['dist/migration/*.js'],
        migrationsRun: true,
        cli: {
            migrationsDir: 'src/migration',
        },
        keepConnectionAlive: true,
    }),
];

export default testUtilModule;

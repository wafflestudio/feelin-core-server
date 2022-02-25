import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1645797784328 implements MigrationInterface {
    name = 'Init1645797784328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`track\` (\`id\` int NOT NULL AUTO_INCREMENT, \`melonId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stream_playlist\` (\`id\` int NOT NULL AUTO_INCREMENT, \`streamType\` enum ('melon', 'flo', 'genie', 'bugs', 'vibe', 'ytmusic', 'spotify', 'applemusic') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`playlist\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stream_account\` (\`id\` int NOT NULL AUTO_INCREMENT, \`streamType\` enum ('melon', 'flo', 'genie', 'bugs', 'vibe', 'ytmusic', 'spotify', 'applemusic') NOT NULL, \`publicKey\` varchar(255) NOT NULL, \`privateKey\` varchar(255) NOT NULL, \`cookie\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_0c4c87c4a84aff4382f1c9ca2e\` (\`privateKey\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`playlist_tracks_track\` (\`playlistId\` int NOT NULL, \`trackId\` int NOT NULL, INDEX \`IDX_53e780b9e2955ef02466636cda\` (\`playlistId\`), INDEX \`IDX_54dd1e92dd268df3dcc0cbb643\` (\`trackId\`), PRIMARY KEY (\`playlistId\`, \`trackId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`stream_account\` ADD CONSTRAINT \`FK_0796916bf344d4b8a47bc8a630f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`playlist_tracks_track\` ADD CONSTRAINT \`FK_53e780b9e2955ef02466636cda7\` FOREIGN KEY (\`playlistId\`) REFERENCES \`playlist\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`playlist_tracks_track\` ADD CONSTRAINT \`FK_54dd1e92dd268df3dcc0cbb643c\` FOREIGN KEY (\`trackId\`) REFERENCES \`track\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`playlist_tracks_track\` DROP FOREIGN KEY \`FK_54dd1e92dd268df3dcc0cbb643c\``);
        await queryRunner.query(`ALTER TABLE \`playlist_tracks_track\` DROP FOREIGN KEY \`FK_53e780b9e2955ef02466636cda7\``);
        await queryRunner.query(`ALTER TABLE \`stream_account\` DROP FOREIGN KEY \`FK_0796916bf344d4b8a47bc8a630f\``);
        await queryRunner.query(`DROP INDEX \`IDX_54dd1e92dd268df3dcc0cbb643\` ON \`playlist_tracks_track\``);
        await queryRunner.query(`DROP INDEX \`IDX_53e780b9e2955ef02466636cda\` ON \`playlist_tracks_track\``);
        await queryRunner.query(`DROP TABLE \`playlist_tracks_track\``);
        await queryRunner.query(`DROP INDEX \`IDX_0c4c87c4a84aff4382f1c9ca2e\` ON \`stream_account\``);
        await queryRunner.query(`DROP TABLE \`stream_account\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`playlist\``);
        await queryRunner.query(`DROP TABLE \`stream_playlist\``);
        await queryRunner.query(`DROP TABLE \`track\``);
    }

}

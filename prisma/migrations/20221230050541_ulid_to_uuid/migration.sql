/*
  Warnings:

  - The primary key for the `albums` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `artist_on_album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `artist_on_track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `artists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `playlists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `track_on_playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tracks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vendor_accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vendor_albums` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vendor_artists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vendor_playlists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `vendor_tracks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `artist_on_album` DROP FOREIGN KEY `artist_on_album_album_id_fkey`;

-- DropForeignKey
ALTER TABLE `artist_on_album` DROP FOREIGN KEY `artist_on_album_artist_id_fkey`;

-- DropForeignKey
ALTER TABLE `artist_on_track` DROP FOREIGN KEY `artist_on_track_artist_id_fkey`;

-- DropForeignKey
ALTER TABLE `artist_on_track` DROP FOREIGN KEY `artist_on_track_track_id_fkey`;

-- DropForeignKey
ALTER TABLE `track_on_playlist` DROP FOREIGN KEY `track_on_playlist_playlist_id_fkey`;

-- DropForeignKey
ALTER TABLE `track_on_playlist` DROP FOREIGN KEY `track_on_playlist_track_id_fkey`;

-- DropForeignKey
ALTER TABLE `tracks` DROP FOREIGN KEY `tracks_album_id_fkey`;

-- DropForeignKey
ALTER TABLE `vendor_accounts` DROP FOREIGN KEY `vendor_accounts_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `vendor_albums` DROP FOREIGN KEY `vendor_albums_album_id_fkey`;

-- DropForeignKey
ALTER TABLE `vendor_artists` DROP FOREIGN KEY `vendor_artists_artist_id_fkey`;

-- DropForeignKey
ALTER TABLE `vendor_playlists` DROP FOREIGN KEY `vendor_playlists_playlist_id_fkey`;

-- DropForeignKey
ALTER TABLE `vendor_tracks` DROP FOREIGN KEY `vendor_tracks_track_id_fkey`;

-- AlterTable
ALTER TABLE `albums` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `artist_on_album` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `artist_id` VARCHAR(36) NOT NULL,
    MODIFY `album_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `artist_on_track` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `artist_id` VARCHAR(36) NOT NULL,
    MODIFY `track_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `artists` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `playlists` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `track_on_playlist` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `playlist_id` VARCHAR(36) NOT NULL,
    MODIFY `track_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tracks` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `album_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vendor_accounts` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `user_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vendor_albums` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `album_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vendor_artists` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `artist_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vendor_playlists` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `playlist_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vendor_tracks` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(36) NOT NULL,
    MODIFY `track_id` VARCHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `artist_on_track` ADD CONSTRAINT `artist_on_track_artist_id_fkey` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artist_on_track` ADD CONSTRAINT `artist_on_track_track_id_fkey` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artist_on_album` ADD CONSTRAINT `artist_on_album_artist_id_fkey` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artist_on_album` ADD CONSTRAINT `artist_on_album_album_id_fkey` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `track_on_playlist` ADD CONSTRAINT `track_on_playlist_playlist_id_fkey` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `track_on_playlist` ADD CONSTRAINT `track_on_playlist_track_id_fkey` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tracks` ADD CONSTRAINT `tracks_album_id_fkey` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendor_accounts` ADD CONSTRAINT `vendor_accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendor_albums` ADD CONSTRAINT `vendor_albums_album_id_fkey` FOREIGN KEY (`album_id`) REFERENCES `albums`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendor_artists` ADD CONSTRAINT `vendor_artists_artist_id_fkey` FOREIGN KEY (`artist_id`) REFERENCES `artists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendor_playlists` ADD CONSTRAINT `vendor_playlists_playlist_id_fkey` FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vendor_tracks` ADD CONSTRAINT `vendor_tracks_track_id_fkey` FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

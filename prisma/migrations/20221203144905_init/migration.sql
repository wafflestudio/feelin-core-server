-- CreateTable
CREATE TABLE `albums` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `cover_url` VARCHAR(400) NOT NULL,
    `description` VARCHAR(500) NULL,
    `release_date` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artists` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `name` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artist_on_track` (
    `id` VARCHAR(26) NOT NULL,
    `artist_id` VARCHAR(26) NOT NULL,
    `track_id` VARCHAR(26) NOT NULL,
    `artist_sequence` TINYINT UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artist_on_album` (
    `id` VARCHAR(26) NOT NULL,
    `artist_id` VARCHAR(26) NOT NULL,
    `album_id` VARCHAR(26) NOT NULL,
    `artist_sequence` TINYINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Migrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `playlists` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `duration` INTEGER UNSIGNED NOT NULL,
    `cover_url` VARCHAR(400) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `track_on_playlist` (
    `id` VARCHAR(26) NOT NULL,
    `playlist_id` VARCHAR(26) NOT NULL,
    `track_id` VARCHAR(26) NOT NULL,
    `track_sequence` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tracks` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `duration` INTEGER UNSIGNED NOT NULL,
    `track_sequence` INTEGER UNSIGNED NOT NULL,
    `album_id` VARCHAR(26) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `username` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendor_accounts` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `deactivated_at` DATETIME(6) NULL,
    `vendor` VARCHAR(32) NOT NULL,
    `encryption_key` BINARY(32) NOT NULL,
    `user_id` VARCHAR(26) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendor_albums` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `vendor` VARCHAR(32) NOT NULL,
    `vendor_id` VARCHAR(255) NOT NULL,
    `album_id` VARCHAR(26) NOT NULL,

    INDEX `vendor_album_vendor_id_idx`(`vendor_id`, `vendor`),
    UNIQUE INDEX `vendor_album_vendor_id`(`vendor_id`, `vendor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendor_artists` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `vendor` VARCHAR(32) NOT NULL,
    `vendor_id` VARCHAR(255) NOT NULL,
    `artist_id` VARCHAR(26) NOT NULL,

    INDEX `vendor_artist_vendor_id_idx`(`vendor_id`, `vendor`),
    UNIQUE INDEX `vendor_artist_vendor_id`(`vendor_id`, `vendor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendor_playlists` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `vendor` VARCHAR(32) NOT NULL,
    `vendor_id` VARCHAR(255) NOT NULL,
    `playlist_id` VARCHAR(26) NOT NULL,

    INDEX `vendor_playlist_vendor_id_idx`(`vendor_id`, `vendor`),
    UNIQUE INDEX `vendor_playlist_vendor_id`(`vendor_id`, `vendor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vendor_tracks` (
    `id` VARCHAR(26) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL,
    `vendor` VARCHAR(32) NOT NULL,
    `vendor_id` VARCHAR(255) NOT NULL,
    `track_id` VARCHAR(26) NOT NULL,

    INDEX `vendor_track_vendor_id_idx`(`vendor_id`, `vendor`),
    UNIQUE INDEX `vendor_track_vendor_id`(`vendor_id`, `vendor`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

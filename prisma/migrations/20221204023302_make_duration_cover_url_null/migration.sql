-- AlterTable
ALTER TABLE `playlists` MODIFY `duration` INTEGER UNSIGNED NULL,
    MODIFY `cover_url` VARCHAR(400) NULL;

-- AlterTable
ALTER TABLE `tracks` MODIFY `duration` INTEGER UNSIGNED NULL;

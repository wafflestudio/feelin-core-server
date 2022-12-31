/*
  Warnings:

  - You are about to drop the column `encryption_key` on the `vendor_accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `vendor_accounts` DROP COLUMN `encryption_key`,
    ADD COLUMN `access_token` VARCHAR(2047) NULL,
    ADD COLUMN `expires_at` DATETIME(6) NULL,
    ADD COLUMN `refresh_token` VARCHAR(2047) NULL;

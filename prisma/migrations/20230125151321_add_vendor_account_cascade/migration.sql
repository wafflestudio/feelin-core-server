-- DropForeignKey
ALTER TABLE `vendor_accounts` DROP FOREIGN KEY `vendor_accounts_user_id_fkey`;

-- AddForeignKey
ALTER TABLE `vendor_accounts` ADD CONSTRAINT `vendor_accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

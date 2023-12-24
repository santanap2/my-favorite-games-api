-- CreateTable
CREATE TABLE `carts` (
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `carts_userId_key`(`userId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CartToGame` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CartToGame_AB_unique`(`A`, `B`),
    INDEX `_CartToGame_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `carts` ADD CONSTRAINT `carts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CartToGame` ADD CONSTRAINT `_CartToGame_A_fkey` FOREIGN KEY (`A`) REFERENCES `carts`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CartToGame` ADD CONSTRAINT `_CartToGame_B_fkey` FOREIGN KEY (`B`) REFERENCES `games`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

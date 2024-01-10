/*
  Warnings:

  - You are about to drop the column `genre` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `genrePt` on the `games` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `games` DROP COLUMN `genre`,
    DROP COLUMN `genrePt`;

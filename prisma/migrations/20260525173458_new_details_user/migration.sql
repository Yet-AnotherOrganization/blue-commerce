/*
  Warnings:

  - You are about to drop the column `activateAccountLink` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "AccountStatus" ADD VALUE 'PENDING';

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "activateAccountLink",
ADD COLUMN     "activateAccountCode" TEXT;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

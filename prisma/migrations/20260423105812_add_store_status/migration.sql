-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('ACTIVE', 'DISABLED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "status" "StoreStatus" NOT NULL DEFAULT 'DISABLED';

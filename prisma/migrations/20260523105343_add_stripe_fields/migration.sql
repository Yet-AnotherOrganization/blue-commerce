/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stripeSessionId" TEXT,
ADD COLUMN     "totalAmount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeSessionId_key" ON "Order"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

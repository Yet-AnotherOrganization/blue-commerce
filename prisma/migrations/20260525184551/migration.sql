/*
  Warnings:

  - A unique constraint covering the columns `[activateAccountCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_activateAccountCode_key" ON "User"("activateAccountCode");

/*
  Warnings:

  - A unique constraint covering the columns `[registerId]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registerId` to the `Driver` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "registerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Driver_registerId_key" ON "Driver"("registerId");

/*
  Warnings:

  - The `mileage` column on the `Truck` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `capacity` on the `Truck` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Truck" DROP COLUMN "capacity",
ADD COLUMN     "capacity" TEXT NOT NULL,
DROP COLUMN "mileage",
ADD COLUMN     "mileage" TEXT;

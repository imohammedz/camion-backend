/*
  Warnings:

  - The primary key for the `Fleet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Truck` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Truck" DROP CONSTRAINT "Truck_fleet_id_fkey";

-- AlterTable
ALTER TABLE "Fleet" DROP CONSTRAINT "Fleet_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Fleet_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Fleet_id_seq";

-- AlterTable
ALTER TABLE "Truck" DROP CONSTRAINT "Truck_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "fleet_id" DROP DEFAULT,
ALTER COLUMN "fleet_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Truck_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Truck_id_seq";
DROP SEQUENCE "Truck_fleet_id_seq";

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_fleet_id_fkey" FOREIGN KEY ("fleet_id") REFERENCES "Fleet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

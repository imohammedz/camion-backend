-- DropForeignKey
ALTER TABLE "Truck" DROP CONSTRAINT "Truck_driver_id_fkey";

-- AlterTable
ALTER TABLE "Truck" ALTER COLUMN "driver_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

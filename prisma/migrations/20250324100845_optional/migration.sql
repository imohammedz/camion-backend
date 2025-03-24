-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_fleetId_fkey";

-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "fleetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_fleetId_fkey" FOREIGN KEY ("fleetId") REFERENCES "Fleet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Fleet" (
    "id" SERIAL NOT NULL,
    "fleet_name" TEXT NOT NULL,
    "fleet_base_location" TEXT,
    "operational_status" TEXT NOT NULL DEFAULT 'fully operational',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fleet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Truck" (
    "id" SERIAL NOT NULL,
    "truck_model" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "year_of_manufacture" TEXT NOT NULL,
    "capacity" TEXT NOT NULL,
    "dimensions" TEXT,
    "fuel_type" TEXT NOT NULL,
    "mileage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'available',
    "fleet_id" SERIAL NOT NULL,

    CONSTRAINT "Truck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Truck_registration_number_key" ON "Truck"("registration_number");

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_fleet_id_fkey" FOREIGN KEY ("fleet_id") REFERENCES "Fleet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "contactInfo" TEXT NOT NULL,
    "billingAddress" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "pickupLocation" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "shipmentDate" TIMESTAMP(3) NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "packageType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dimensions" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "serviceType" TEXT NOT NULL,
    "insurance" BOOLEAN NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_orderId_key" ON "Shipment"("orderId");

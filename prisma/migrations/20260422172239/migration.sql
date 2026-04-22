/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "OrderItemStatus" ADD VALUE 'PENDING';

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PREPARING';

-- DropIndex
DROP INDEX "orders_orderId_idx";

-- AlterTable
ALTER TABLE "orderItems" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PREPARING';

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "orders"("orderId");

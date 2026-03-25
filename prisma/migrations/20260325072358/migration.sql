/*
  Warnings:

  - The values [PREPARING,READY,DELIVERED,CANCELLED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `quentity` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `_catagoryTomeals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catagory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `rating` on table `restaurants` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `rating` on the `reviews` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('PREPARING', 'READY', 'DELIVERED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('DELIVERING', 'COMPLETE');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'DELIVERING';
COMMIT;

-- DropForeignKey
ALTER TABLE "_catagoryTomeals" DROP CONSTRAINT "_catagoryTomeals_A_fkey";

-- DropForeignKey
ALTER TABLE "_catagoryTomeals" DROP CONSTRAINT "_catagoryTomeals_B_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_orderId_fkey";

-- AlterTable
ALTER TABLE "meals" ALTER COLUMN "rating" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "quentity",
DROP COLUMN "restaurantId",
ADD COLUMN     "orderId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DELIVERING';

-- AlterTable
ALTER TABLE "restaurants" ALTER COLUMN "rating" SET NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "rating",
ADD COLUMN     "rating" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_catagoryTomeals";

-- DropTable
DROP TABLE "catagory";

-- CreateTable
CREATE TABLE "catagories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coverImg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catagories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderItems" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "mealName" TEXT NOT NULL,
    "mealImg" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" "OrderItemStatus" NOT NULL DEFAULT 'PREPARING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_catagoriesTomeals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_catagoriesTomeals_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "catagories_name_key" ON "catagories"("name");

-- CreateIndex
CREATE INDEX "catagories_name_idx" ON "catagories"("name");

-- CreateIndex
CREATE INDEX "catagories_id_idx" ON "catagories"("id");

-- CreateIndex
CREATE INDEX "orderItems_orderId_idx" ON "orderItems"("orderId");

-- CreateIndex
CREATE INDEX "orderItems_restaurantId_idx" ON "orderItems"("restaurantId");

-- CreateIndex
CREATE INDEX "orderItems_mealId_idx" ON "orderItems"("mealId");

-- CreateIndex
CREATE INDEX "orderItems_status_idx" ON "orderItems"("status");

-- CreateIndex
CREATE INDEX "_catagoriesTomeals_B_index" ON "_catagoriesTomeals"("B");

-- CreateIndex
CREATE INDEX "meals_restaurantId_idx" ON "meals"("restaurantId");

-- CreateIndex
CREATE INDEX "meals_available_idx" ON "meals"("available");

-- CreateIndex
CREATE INDEX "meals_name_idx" ON "meals"("name");

-- CreateIndex
CREATE INDEX "meals_price_idx" ON "meals"("price");

-- CreateIndex
CREATE INDEX "meals_rating_idx" ON "meals"("rating");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_orderId_idx" ON "orders"("orderId");

-- CreateIndex
CREATE INDEX "restaurants_ownerId_idx" ON "restaurants"("ownerId");

-- CreateIndex
CREATE INDEX "restaurants_name_idx" ON "restaurants"("name");

-- CreateIndex
CREATE INDEX "restaurants_rating_idx" ON "restaurants"("rating");

-- CreateIndex
CREATE INDEX "restaurants_banned_idx" ON "restaurants"("banned");

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_catagoriesTomeals" ADD CONSTRAINT "_catagoriesTomeals_A_fkey" FOREIGN KEY ("A") REFERENCES "catagories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_catagoriesTomeals" ADD CONSTRAINT "_catagoriesTomeals_B_fkey" FOREIGN KEY ("B") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

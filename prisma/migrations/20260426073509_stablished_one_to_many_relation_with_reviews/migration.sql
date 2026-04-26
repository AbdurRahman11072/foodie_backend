/*
  Warnings:

  - You are about to drop the column `orderId` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `restaurantId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reviews_orderId_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "orderId",
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

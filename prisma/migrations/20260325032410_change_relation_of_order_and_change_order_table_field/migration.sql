/*
  Warnings:

  - You are about to drop the `_mealsToorders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quentity` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_mealsToorders" DROP CONSTRAINT "_mealsToorders_A_fkey";

-- DropForeignKey
ALTER TABLE "_mealsToorders" DROP CONSTRAINT "_mealsToorders_B_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "quentity" INTEGER NOT NULL,
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_mealsToorders";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

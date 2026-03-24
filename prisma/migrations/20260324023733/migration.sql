/*
  Warnings:

  - You are about to drop the column `restaurantsId` on the `meals` table. All the data in the column will be lost.
  - Added the required column `restaurantId` to the `meals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "meals" DROP CONSTRAINT "meals_restaurantsId_fkey";

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "restaurantsId",
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

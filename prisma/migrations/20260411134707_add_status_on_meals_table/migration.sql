/*
  Warnings:

  - You are about to drop the column `allergens` on the `meals` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MealStatus" AS ENUM ('DRFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "meals" DROP COLUMN "allergens",
ADD COLUMN     "status" "MealStatus" NOT NULL DEFAULT 'DRFT';

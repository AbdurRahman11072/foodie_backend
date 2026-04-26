/*
  Warnings:

  - Added the required column `userImg` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "userImg" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;

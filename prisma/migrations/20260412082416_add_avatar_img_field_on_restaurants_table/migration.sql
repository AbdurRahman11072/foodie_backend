/*
  Warnings:

  - You are about to drop the column `avaterImg` on the `restaurants` table. All the data in the column will be lost.
  - Added the required column `avatarImg` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "restaurants" DROP COLUMN "avaterImg",
ADD COLUMN     "avatarImg" TEXT NOT NULL;

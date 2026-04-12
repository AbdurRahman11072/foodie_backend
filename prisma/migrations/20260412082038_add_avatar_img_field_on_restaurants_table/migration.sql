/*
  Warnings:

  - Added the required column `avaterImg` to the `restaurants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "avaterImg" TEXT NOT NULL;

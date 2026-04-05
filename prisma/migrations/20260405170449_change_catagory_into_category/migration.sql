/*
  Warnings:

  - You are about to drop the `_catagoriesTomeals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catagories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_catagoriesTomeals" DROP CONSTRAINT "_catagoriesTomeals_A_fkey";

-- DropForeignKey
ALTER TABLE "_catagoriesTomeals" DROP CONSTRAINT "_catagoriesTomeals_B_fkey";

-- DropTable
DROP TABLE "_catagoriesTomeals";

-- DropTable
DROP TABLE "catagories";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coverImg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_categoriesTomeals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_categoriesTomeals_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_name_idx" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_id_idx" ON "categories"("id");

-- CreateIndex
CREATE INDEX "_categoriesTomeals_B_index" ON "_categoriesTomeals"("B");

-- AddForeignKey
ALTER TABLE "_categoriesTomeals" ADD CONSTRAINT "_categoriesTomeals_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_categoriesTomeals" ADD CONSTRAINT "_categoriesTomeals_B_fkey" FOREIGN KEY ("B") REFERENCES "meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

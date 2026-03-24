/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `catagory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "catagory_name_key" ON "catagory"("name");

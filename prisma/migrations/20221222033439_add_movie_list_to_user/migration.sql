/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_MovieListToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MovieListToUser_AB_unique" ON "_MovieListToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieListToUser_B_index" ON "_MovieListToUser"("B");

-- AddForeignKey
ALTER TABLE "_MovieListToUser" ADD CONSTRAINT "_MovieListToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "MovieList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieListToUser" ADD CONSTRAINT "_MovieListToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

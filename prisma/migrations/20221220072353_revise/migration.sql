/*
  Warnings:

  - The values [leavesecondRound] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updataAt` on the `MovieList` table. All the data in the column will be lost.
  - You are about to drop the column `updataAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `updateAt` to the `MovieList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('notReleased', 'firstRound', 'leaveFirstRound', 'secondRound', 'leaveSecondRound', 'Streaming');
ALTER TABLE "MovieList" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "MovieList" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "MovieList" ALTER COLUMN "status" SET DEFAULT 'notReleased';
COMMIT;

-- AlterTable
ALTER TABLE "MovieList" DROP COLUMN "updataAt",
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updataAt",
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

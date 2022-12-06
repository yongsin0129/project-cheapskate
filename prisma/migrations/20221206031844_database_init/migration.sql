-- CreateEnum
CREATE TYPE "Status" AS ENUM ('notReleased', 'firstRound', 'leaveFirstRound', 'secondRound', 'leavesecondRound', 'Streaming');

-- CreateTable
CREATE TABLE "MovieList" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "url" TEXT,
    "status" "Status" NOT NULL DEFAULT 'notReleased',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updataAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MovieList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updataAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieList_title_releaseDate_key" ON "MovieList"("title", "releaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

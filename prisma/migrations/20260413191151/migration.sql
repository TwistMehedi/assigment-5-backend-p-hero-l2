/*
  Warnings:

  - A unique constraint covering the columns `[userId,mediaId,seriesId]` on the table `Watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Watchlist_userId_mediaId_key";

-- AlterTable
ALTER TABLE "Watchlist" ALTER COLUMN "mediaId" DROP NOT NULL,
ALTER COLUMN "seriesId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_userId_mediaId_seriesId_key" ON "Watchlist"("userId", "mediaId", "seriesId");

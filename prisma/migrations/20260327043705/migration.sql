/*
  Warnings:

  - You are about to drop the column `mediaCount` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `releaseYear` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `streamingPlatform` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Media` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seriesId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seriesId` to the `Watchlist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Categories" DROP CONSTRAINT "Categories_userId_fkey";

-- DropIndex
DROP INDEX "Categories_name_key";

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "mediaCount",
DROP COLUMN "slug",
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "genres",
DROP COLUMN "releaseYear",
DROP COLUMN "streamingPlatform",
DROP COLUMN "type",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ADD COLUMN     "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "trailerUrl" TEXT,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "seriesId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "seriesId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "totalMovie" TEXT,
    "totalSeries" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT NOT NULL,
    "duration" TEXT,
    "thumbnailUrl" TEXT,
    "seasonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" TEXT,
    "seriesId" TEXT,
    "isLike" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "director" TEXT,
    "cast" TEXT[],
    "posterUrl" TEXT,
    "trailerUrl" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "MediaStatus" NOT NULL DEFAULT 'PENDING',
    "views" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "title" TEXT,
    "seriesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_mediaId_key" ON "Like"("userId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_seriesId_key" ON "Like"("userId", "seriesId");

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

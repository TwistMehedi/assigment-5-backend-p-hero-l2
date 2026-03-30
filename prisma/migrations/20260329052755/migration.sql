/*
  Warnings:

  - You are about to drop the column `thumbnailUrl` on the `Episode` table. All the data in the column will be lost.
  - The `duration` column on the `Episode` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `averageRating` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the `_ChannelToSeries` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `videoPublicId` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Series" DROP CONSTRAINT "Series_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToSeries" DROP CONSTRAINT "_ChannelToSeries_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToSeries" DROP CONSTRAINT "_ChannelToSeries_B_fkey";

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "thumbnailUrl",
ADD COLUMN     "videoPublicId" TEXT NOT NULL,
DROP COLUMN "duration",
ADD COLUMN     "duration" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "posterUrl" TEXT;

-- AlterTable
ALTER TABLE "Series" DROP COLUMN "averageRating",
DROP COLUMN "categoryId",
DROP COLUMN "status",
DROP COLUMN "views",
ADD COLUMN     "channelId" TEXT,
ADD COLUMN     "posterUrlPublicId" TEXT,
ADD COLUMN     "trailerUrlPublicId" TEXT;

-- DropTable
DROP TABLE "_ChannelToSeries";

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

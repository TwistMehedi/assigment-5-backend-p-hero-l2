/*
  Warnings:

  - You are about to drop the column `mediaId` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `seriesId` on the `Channel` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_seriesId_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "mediaId",
DROP COLUMN "seriesId",
ALTER COLUMN "totalMovie" SET DEFAULT '0',
ALTER COLUMN "totalSeries" SET DEFAULT '0';

-- CreateTable
CREATE TABLE "_ChannelToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChannelToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ChannelToSeries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChannelToSeries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ChannelToMedia_B_index" ON "_ChannelToMedia"("B");

-- CreateIndex
CREATE INDEX "_ChannelToSeries_B_index" ON "_ChannelToSeries"("B");

-- AddForeignKey
ALTER TABLE "_ChannelToMedia" ADD CONSTRAINT "_ChannelToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToMedia" ADD CONSTRAINT "_ChannelToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToSeries" ADD CONSTRAINT "_ChannelToSeries_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelToSeries" ADD CONSTRAINT "_ChannelToSeries_B_fkey" FOREIGN KEY ("B") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

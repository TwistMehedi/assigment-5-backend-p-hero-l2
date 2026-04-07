/*
  Warnings:

  - You are about to drop the column `status` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "status",
DROP COLUMN "tags",
ADD COLUMN     "parentId" TEXT,
ALTER COLUMN "hasSpoiler" DROP NOT NULL,
ALTER COLUMN "mediaId" DROP NOT NULL,
ALTER COLUMN "seriesId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

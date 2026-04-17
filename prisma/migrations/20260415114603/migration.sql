/*
  Warnings:

  - You are about to drop the column `hasSpoiler` on the `Review` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "commentStatus" "CommentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "mediaId" TEXT;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "hasSpoiler",
ADD COLUMN     "status" "CommentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "tags" TEXT[];

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_reviewId_idx" ON "Comment"("reviewId");

-- CreateIndex
CREATE INDEX "Comment_mediaId_idx" ON "Comment"("mediaId");

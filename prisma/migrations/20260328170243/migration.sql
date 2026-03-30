/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Media` table. All the data in the column will be lost.
  - Added the required column `genre` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnailPublicId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Made the column `thumbnailUrl` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_categoryId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "categoryId",
ADD COLUMN     "categoriesId" TEXT,
ADD COLUMN     "genre" TEXT NOT NULL,
ADD COLUMN     "posterPublicId" TEXT,
ADD COLUMN     "thumbnailPublicId" TEXT NOT NULL,
ADD COLUMN     "trailerUrlPublicId" TEXT,
ADD COLUMN     "videoUrlPublicId" TEXT,
ALTER COLUMN "averageRating" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'APPROVED',
ALTER COLUMN "thumbnailUrl" SET NOT NULL,
ALTER COLUMN "views" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

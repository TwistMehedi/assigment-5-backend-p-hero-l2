-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "totalReviews" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "hasPassword" BOOLEAN DEFAULT false;

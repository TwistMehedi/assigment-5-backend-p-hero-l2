/*
  Warnings:

  - Added the required column `genre` to the `Series` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseDate` to the `Series` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Series" ADD COLUMN     "genre" TEXT NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;

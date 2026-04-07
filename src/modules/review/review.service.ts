import { prisma } from "../../lib/prisma";
import { ErrorHandler } from "../../utils/errorHandler";

export const createReviewService = async (
  userId: string,
  payload: {
    rating: number;
    content: string;
    hasSpoiler?: boolean;
    mediaId?: string;
    seriesId?: string;
    parentId?: string;
  },
) => {
  const { rating, content, hasSpoiler, mediaId, seriesId, parentId } = payload;

  if (!parentId && !mediaId && !seriesId) {
    throw new ErrorHandler(
      "Either media or series must be provided for a new review",
      400,
    );
  }

  let reviewData: any = {
    rating: parentId ? 0 : rating,
    content,
    hasSpoiler: hasSpoiler ?? false,
    userId,
  };

  if (mediaId) reviewData.mediaId = mediaId;
  if (seriesId) reviewData.seriesId = seriesId;
  if (parentId) reviewData.parentId = parentId;

  const review = await prisma.review.create({
    data: reviewData,
    include: {
      user: {
        select: { name: true, image: true },
      },
      parent: {
        select: { id: true, content: true },
      },
    },
  });

  return review;
};

export const getReviewsByMedia = async (
  id: string,
  type: "MOVIE" | "SERIES",
) => {
  const whereCondition: any =
    type === "MOVIE" ? { mediaId: id } : { seriesId: id };

  whereCondition.parentId = null;

  const reviews = await prisma.review.findMany({
    where: whereCondition,
    include: {
      user: { select: { name: true, image: true } },
      _count: { select: { likes: true } },
      replies: {
        include: {
          user: { select: { name: true, image: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

export const deleteReviewService = async (id: string, userId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) throw new ErrorHandler("Review not found", 404);
  if (review.userId !== userId) throw new ErrorHandler("Unauthorized", 403);

  return await prisma.review.delete({ where: { id } });
};

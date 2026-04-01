//admin

import { Prisma } from "../../generated/prisma";
import { sendResponse } from "../../helper/sendResponse";
import { prisma } from "../../lib/prisma";
import { IMoviePayload } from "../../types/interface/movie/interface.movie";
import { ErrorHandler } from "../../utils/errorHandler";
import { TryCatch } from "../../utils/TryCatch";
import {
  chennelService,
  createCategory,
  createChannelService,
  deleteChannelService,
  deleteMovieService,
  getChannelsService,
  // getMovieService,
  getMyMovies,
  getMyMovieService,
  updateChannelService,
  updateMovieService,
  uploadMovieService,
} from "./movie.service";

export const addCategoryByAdmin = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const payload = req.body;
  const result = await createCategory(payload, userId);
  sendResponse(res, 201, "Category added successfully", result);
});

export const getCategories = TryCatch(async (req, res, next) => {
  const result = await prisma.categories.findMany({});
  sendResponse(res, 200, "Categories fetched successfully", result);
});

export const createChannel = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const file = req?.file as Express.Multer.File;
  const userId = req.user?.id as string;

  const result = await createChannelService(payload, file, userId);

  sendResponse(res, 201, "Channel added successfully", result);
});

export const channels = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;

  const result = await getChannelsService(userId);

  sendResponse(res, 200, "Channels fetched successfully", result);
});

export const updateChannel = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const payload = req.body;

  const file = req?.file as Express.Multer.File;
  const result = await updateChannelService(payload, id, file, userId);

  sendResponse(res, 200, "Channel updated successfully", result);
});

export const deleteChannel = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const result = await deleteChannelService(userId, id);
  sendResponse(res, 201, "Channel delete successfully", result);
});

export const channel = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;

  const result = await chennelService(userId, id);
  sendResponse(res, 200, "Channel goted", result);
});

export const uploadMovie = TryCatch(async (req, res, next) => {
  const userId = req.user?.id;
  const payload = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const thumbnail = files?.thumbnail?.[0]?.path;
  const thumbnailPublicId = files?.thumbnail?.[0]?.filename;

  const poster = files?.poster?.[0]?.path;
  const posterPublicId = files?.poster?.[0]?.filename;

  const video = files?.video?.[0]?.path;
  const videoPublicId = files?.video?.[0]?.filename;

  const moviePayload = {
    ...payload,
    userId: userId as string,
    thumbnail: { url: thumbnail, public_id: thumbnailPublicId },
    poster: { url: poster, public_id: posterPublicId },
    video: { url: video, public_id: videoPublicId },
  };

  const result = await uploadMovieService(moviePayload);

  sendResponse(res, 201, "Movie Uploaded Successfully", result);
});

export const updateMovie = TryCatch(async (req, res) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const updatePayload: Partial<IMoviePayload> & Record<string, any> = {
    ...req.body,
  };

  if (files?.thumbnail?.[0]) {
    updatePayload.thumbnailUrl = files.thumbnail[0].path;
    updatePayload.thumbnailPublicId = files.thumbnail[0].filename;
  }
  if (files?.poster?.[0]) {
    updatePayload.posterUrl = files.poster[0].path;
    updatePayload.posterPublicId = files.poster[0].filename;
  }
  if (files?.video?.[0]) {
    updatePayload.videoUrl = files.video[0].path;
    updatePayload.videoUrlPublicId = files.video[0].filename;
  }

  const result = await updateMovieService(id, updatePayload, userId);
  sendResponse(res, 200, "Movie Updated Successfully", result);
});

//need check
export const deleteMovie = TryCatch(async (req, res) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const result = await deleteMovieService(userId, id);
  sendResponse(res, 200, "Movie deleted successfully", result);
});

export const myMovie = TryCatch(async (req, res) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;
  const result = await getMyMovieService(userId, id);
  sendResponse(res, 200, "Movie got successfully", result);
});

export const myMovies = TryCatch(async (req, res) => {
  const userId = req.user?.id as string;
  const filters = {
    searchTerm: req.query.searchTerm as string,
    page: req.query.page as string,
    limit: req.query.limit as string,
  };
  const result = await getMyMovies(userId, filters);

  sendResponse(res, 200, "My movies got successfully", result);
});

export const allMovies = TryCatch(async (req, res) => {
  const search =
    typeof req.query.search === "string" ? req.query.search : undefined;
  const category =
    typeof req.query.category === "string" ? req.query.category : undefined;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const take = limit;

  const where: Prisma.MediaWhereInput = {
    AND: [],
  };

  if (search) {
    (where.AND as any).push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { cast: { hasSome: [search] } },
        { director: { contains: search, mode: "insensitive" } },
        { genre: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (category && category !== "All") {
    (where.AND as any).push({
      genre: { equals: category },
    });
  }

  const [movies, totalMovies] = await Promise.all([
    prisma.media.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.media.count({ where }),
  ]);

  // console.log("Fetched movies:", movies);
  sendResponse(res, 200, "Movies fetched successfully", {
    movies,
    pagination: {
      totalMovies,
      totalPages: Math.ceil(totalMovies / take),
      currentPage: page,
      limit: take,
    },
  });
});

export const movie = TryCatch(async (req, res, next) => {
  const id = req.params.id as string;
  const movie = await prisma.media.findFirst({
    where: { id },
  });
  if (!movie) {
    next(new ErrorHandler("Movie not found", 400));
  }
  sendResponse(res, 200, "Movie fetched successfully", movie);
});

import { deleteCloudinaryImage } from "../../config/cloudinary";
import { prisma } from "../../lib/prisma";
import { ISeriesPayload } from "../../types/interface/movie/interface.series";
import { ErrorHandler } from "../../utils/errorHandler";

export const createSeriesSevice = async (payload: ISeriesPayload) => {
  const {
    userId,
    title,
    description,
    director,
    cast,
    genre,
    releaseDate,
    price,
    isPremium,
    poster,
    posterUrlPublicId,
    trailer,
    trailerUrlPublicId,
    ...rest
  } = payload;

  const createData: any = {
    ...rest,
    cast: typeof cast === "string" ? JSON.parse(cast) : cast,
    price: parseFloat(price || "0"),
    isPremium: Boolean(isPremium),
  };

  if (poster) createData.posterUrl = poster;
  if (posterUrlPublicId) createData.posterPublicId = posterUrlPublicId;
  if (trailer) createData.trailerUrl = trailer;
  if (trailerUrlPublicId) createData.trailerPublicId = trailerUrlPublicId;

  if (userId) createData.userId = userId;

  const result = await prisma.series.create({
    data: createData,
  });

  return result;
};

export const updateSeriesService = async (
  id: string,
  payload: Partial<ISeriesPayload> & Record<string, any>,
  userId: string,
) => {
  const {
    title,
    description,
    director,
    genre,
    releaseDate,
    cast,
    price,
    isPremium,
    poster,
    posterUrlPublicId,
    trailer,
    trailerUrlPublicId,
    ...rest
  } = payload;

  const updateData: any = { ...rest };

  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (director) updateData.director = director;
  if (genre) updateData.genre = genre;
  if (releaseDate) updateData.releaseDate = new Date(releaseDate);
  if (cast)
    updateData.cast = typeof cast === "string" ? JSON.parse(cast) : cast;
  if (price) updateData.price = parseFloat(price);
  if (isPremium) updateData.isPremium = String(isPremium) === "true";

  if (poster) updateData.posterUrl = poster;
  if (posterUrlPublicId) updateData.posterPublicId = posterUrlPublicId;
  if (trailer) updateData.trailerUrl = trailer;
  if (trailerUrlPublicId) updateData.trailerPublicId = trailerUrlPublicId;

  const series = await prisma.series.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!series) {
    throw new Error("Series not found");
  }

  if (poster) {
    await deleteCloudinaryImage(series.posterUrlPublicId || "");
  }

  if (trailer) {
    await deleteCloudinaryImage(series.trailerUrlPublicId || "");
  }

  const result = await prisma.series.update({
    where: { id, userId },
    data: updateData,
  });

  return result;
};

export const mySeriesesService = async (userId: string) => {
  const serieses = await prisma.series.findMany({
    where: {
      userId,
    },
  });
  return serieses;
};

export const mySeriesService = async (id: string, userId: string) => {
  const series = await prisma.series.findFirst({
    where: {
      id,
      userId,
    },
  });
  return series;
};

export const deleteSeriesService = async (id: string, userId: string) => {
  const series = await prisma.series.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!series) {
    throw new Error("Series not found");
  }

  await deleteCloudinaryImage(series.posterUrlPublicId || "");
  await deleteCloudinaryImage(series.trailerUrlPublicId || "");

  const result = await prisma.series.delete({
    where: {
      id,
      userId,
    },
  });

  return result;
};

export const getAllSeriesService = async (filters: any) => {
  const { searchTerm, category, page = 1, limit = 10 } = filters;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const where: any = {};

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.genre = { equals: category, mode: "insensitive" };
  }

  const [result, total] = await Promise.all([
    prisma.series.findMany({
      where,
      skip,
      take,
      include: {
        seasons: {
          orderBy: {
            seasonNumber: "asc",
          },
          include: {
            episodes: {
              orderBy: {
                episodeNumber: "asc",
              },
              select: {
                id: true,
                title: true,
                episodeNumber: true,
                videoUrl: true,
                duration: true,
              },
            },
          },
        },
        user: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.series.count({ where }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / take),
    },
    data: result,
  };
};

export const createSession = async (
  payload: { seasonNumber: number; title: string; seriesId: string },
  file: Express.Multer.File,
) => {
  const { title, seasonNumber, seriesId } = payload;

  const result = await prisma.season.create({
    data: {
      title,
      seasonNumber,
      posterUrl: file.path,
      posterUrlPublicId: file.filename,
      seriesId,
    },
  });

  return result;
};

export const updateSeasonService = async (
  id: string,
  payload: Partial<{ title?: string; seasonNumber?: number }>,
  file?: Express.Multer.File,
) => {
  const season = await prisma.season.findUnique({
    where: { id },
  });

  if (!season) {
    throw new ErrorHandler("Season not found", 404);
  }

  const updateData: Partial<{
    title?: string;
    seasonNumber?: number;
    posterUrl: string;
    posterUrlPublicId: string;
  }> = {};

  if (payload.title) updateData.title = payload.title;
  if (payload.seasonNumber) updateData.seasonNumber = payload.seasonNumber;

  if (file) {
    updateData.posterUrl = file.path;
    updateData.posterUrlPublicId = file.filename;
    await deleteCloudinaryImage(season.posterUrlPublicId || "");
  }

  const result = await prisma.season.update({
    where: { id },
    data: updateData,
  });

  return result;
};

export const getAllSeasonsService = async (seriesId: string) => {
  const seasons = await prisma.season.findMany({
    where: { seriesId },
    orderBy: { seasonNumber: "asc" },
    include: {
      episodes: {
        orderBy: { episodeNumber: "asc" },
        select: {
          id: true,
          title: true,
          episodeNumber: true,
          videoUrl: true,
          duration: true,
        },
      },
    },
  });

  return seasons;
};

// episodes can be added here in future
export const createEpisode = async (
  payload: {
    title: string;
    episodeNumber: number;
    description?: string;
    duration: number;
    seasonId: string;
  },
  file: Express.Multer.File,
) => {
  const { episodeNumber, title, description, duration, seasonId } = payload;

  const createData: any = {
    title,
    description,
    episodeNumber: Number(episodeNumber),
    seasonId,
    duration: duration ? Number(duration) : 0,
  };

  const { path, filename } = file;
  const result = await prisma.episode.create({
    data: {
      ...createData,
      videoUrl: path,
      videoPublicId: filename,
    },
  });
  return result;
};

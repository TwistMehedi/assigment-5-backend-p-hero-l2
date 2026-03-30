import { sendResponse } from "../../helper/sendResponse";
import { ISeriesPayload } from "../../types/interface/movie/interface.series";
import { TryCatch } from "../../utils/TryCatch";
import {
  createEpisode,
  createSeriesSevice,
  createSession,
  deleteSeriesService,
  getAllSeasonsService,
  getAllSeriesService,
  mySeriesesService,
  mySeriesService,
  updateSeasonService,
  updateSeriesService,
} from "./series.service";

export const createSeries = TryCatch(async (req, res, next) => {
  const userId = req.user?.id;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const seriesData: ISeriesPayload = {
    ...req.body,
    userId,
    poster: files?.poster?.[0]?.path,
    posterUrlPublicId: files?.poster?.[0]?.filename,

    trailer: files?.trailer?.[0]?.path,
    trailerUrlPublicId: files?.trailer?.[0]?.filename,
  };

  const result = await createSeriesSevice(seriesData);
  sendResponse(res, 201, "Series Created Successfully", result);
});

export const updateSeries = TryCatch(async (req, res, next) => {
  const id = req.params.id as string;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const userId = req.user?.id as string;

  const updatePayload: Partial<ISeriesPayload> = { ...req.body };

  if (files?.poster?.[0]) {
    updatePayload.poster = files.poster[0].path;
    updatePayload.posterUrlPublicId = files.poster[0].filename;
  }

  if (files?.trailer?.[0]) {
    updatePayload.trailer = files.trailer[0].path;
    updatePayload.trailerUrlPublicId = files.trailer[0].filename;
  }

  const result = await updateSeriesService(id, updatePayload, userId);

  sendResponse(res, 200, "Series Updated Successfully", result);
});

export const mySerieses = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const result = await mySeriesesService(userId);
  sendResponse(res, 200, "My Serieses Retrieved Successfully", result);
});

export const mySeries = TryCatch(async (req, res, next) => {
  const id = req.params.id as string;
  const userId = req.user?.id as string;
  const result = await mySeriesService(id, userId);
  sendResponse(res, 200, "My Series Retrieved Successfully", result);
});

export const deleteSeries = TryCatch(async (req, res, next) => {
  const id = req.params.id as string;
  const userId = req.user?.id as string;
  const result = await deleteSeriesService(id, userId);
  sendResponse(res, 200, "Series Deleted Successfully", result);
});

export const getAllSeries = TryCatch(async (req, res, next) => {
  const filters = req.query;

  const result = await getAllSeriesService(filters);

  sendResponse(res, 200, "All Series Retrieved Successfully", result);
});

// session
export const uploadSession = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const file = req.file as Express.Multer.File;
  const result = await createSession(payload, file);
  sendResponse(res, 201, "Session Created Successfully", result);
});

export const updateSeason = TryCatch(async (req, res, next) => {
  const id = req.params.id as string;
  const file = req.file as Express.Multer.File;
  const payload: Partial<{ title?: string; seasonNumber?: number }> = req.body;
  const result = await updateSeasonService(id, payload, file);
  sendResponse(res, 200, "Session Updated Successfully", result);
});

export const allSeasons = TryCatch(async (req, res, next) => {
  const seriesId = req.params.seriesId as string;
  const result = await getAllSeasonsService(seriesId);
  sendResponse(res, 200, "All Seasons Retrieved Successfully", result);
});

// episodes can be added here in future
export const uploadEpisode = TryCatch(async (req, res, next) => {
  const payload = req.body;

  const file = req.file as Express.Multer.File;

  const result = await createEpisode(payload, file);

  sendResponse(
    res,
    200,
    "Episode upload functionality will be implemented in the future",
    result,
  );
});

export const updateEpisode = TryCatch(async (req, res, next) => {
  // Implementation for updating an episode will go here in the future
  sendResponse(
    res,
    200,
    "Episode update functionality will be implemented in the future",
    null,
  );
});

export const allEpisodes = TryCatch(async (req, res, next) => {
  // Implementation for retrieving all episodes will go here in the future
  sendResponse(
    res,
    200,
    "Episode retrieval functionality will be implemented in the future",
    null,
  );
});

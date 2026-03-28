//admin

import { sendResponse } from "../../helper/sendResponse";
import { prisma } from "../../lib/prisma";
import { TryCatch } from "../../utils/TryCatch";
import {
  chennelService,
  createCategory,
  createChannelService,
  deleteChannelService,
  getChannelsService,
  updateChannelService,
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

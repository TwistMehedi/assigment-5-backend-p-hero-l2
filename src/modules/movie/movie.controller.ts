//admin

import { sendResponse } from "../../helper/sendResponse";
import { prisma } from "../../lib/prisma";
import { TryCatch } from "../../utils/TryCatch";
import { createCategory, createChannelService } from "./movie.service";

export const addCategoryByAdmin = TryCatch(async (req, res, next) => {
  const userId = req.user?.id as string;
  const payload = req.body;
  const result = await createCategory(payload, userId);
  sendResponse(res, 200, "Category added successfully", result);
});

export const getCategories = TryCatch(async (req, res, next) => {
  const result = await prisma.categories.findMany({});
  sendResponse(res, 200, "Categories fetched successfully", result);
});

export const createChannel = TryCatch(async (req, res, next) => {
  const payload = req.body;
  const file = req?.file as Express.Multer.File;
  const userId = req.user?.id as string;
  // console.log(file);
  const result = await createChannelService(payload, file, userId);
  // console.log(result);
  sendResponse(res, 200, "Channel added successfully", result);
});

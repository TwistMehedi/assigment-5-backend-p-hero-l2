//admin

import { sendResponse } from "../../helper/sendResponse";
import { prisma } from "../../lib/prisma";
import { TryCatch } from "../../utils/TryCatch";
import { createCategory } from "./movie.service";

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

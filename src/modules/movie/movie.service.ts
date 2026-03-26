import { prisma } from "../../lib/prisma";
import { ErrorHandler } from "../../utils/errorHandler";

export const createCategory = async (
  payload: { name: string },
  userId: string,
) => {
  const categoryName = await prisma.categories.findUnique({
    where: {
      name: payload.name,
    },
  });

  if (categoryName) {
    throw new ErrorHandler("Category already exists", 400);
  }

  const category = await prisma.categories.create({
    data: { name: payload.name, userId },
  });
  if (!category) {
    throw new ErrorHandler("Category not created", 400);
  }
  return category;
};

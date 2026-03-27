import { prisma } from "../../lib/prisma";
import { ErrorHandler } from "../../utils/errorHandler";

export const createCategory = async (
  payload: { name: string },
  userId: string,
) => {
  const categoryName = await prisma.categories.findFirst({
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

export const createChannelService = async (
  payload: { name: string; location: string; description: string },
  file: Express.Multer.File,
  userId: string,
) => {
  const existingChannel = await prisma.channel.findFirst({
    where: {
      name: payload.name,
    },
  });

  if (existingChannel) {
    throw new ErrorHandler("CHannel name already created", 400);
  }

  const channel = await prisma.channel.create({
    data: {
      name: payload.name,
      location: payload.location,
      description: payload.description,
      image: file?.path,
      userId,
    },
  });
  if (!channel) {
    throw new ErrorHandler("Channel not created", 400);
  }

  return channel;
};

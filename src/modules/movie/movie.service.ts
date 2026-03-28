import { deleteCloudinaryImage } from "../../config/cloudinary";
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

export const getChannelsService = async (userId: string) => {
  const channels = await prisma.channel.findMany({
    where: {
      userId,
    },
  });
  return channels;
};

export const updateChannelService = async (
  payload: { name: string; location: string; description: string },
  id: string,
  file: Express.Multer.File,
  userId: string,
) => {
  const isChannelExist = await prisma.channel.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!isChannelExist) {
    throw new ErrorHandler("Channel not created", 400);
  }

  if (isChannelExist.name === payload.name) {
    throw new ErrorHandler("Channel name already exist", 400);
  }

  console.log("isChannelExist", isChannelExist);
  if (isChannelExist.image) {
    await deleteCloudinaryImage(isChannelExist.image);
  }

  let imageUrl = isChannelExist.image;

  if (file) {
    imageUrl = file.path;
  }

  const channel = await prisma.channel.update({
    where: {
      id,
      userId,
    },
    data: {
      name: payload.name,
      location: payload.location,
      description: payload.description,
      image: imageUrl,
    },
  });
  if (!channel) {
    throw new ErrorHandler("Channel not updated", 400);
  }

  return channel;
};

export const deleteChannelService = async (userId: string, id: string) => {
  const channel = await prisma.channel.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!channel) {
    throw new ErrorHandler("Delete channel not found", 400);
  }

  const deleteChannel = await prisma.channel.delete({
    where: {
      id,
      userId,
    },
  });

  if (!deleteChannel) {
    throw new ErrorHandler("CHannel delete problem", 404);
  }

  return deleteChannel;
};

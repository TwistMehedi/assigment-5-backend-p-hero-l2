import { v2 as cloudinary } from "cloudinary";
import { env } from "./envConfig";
import { ErrorHandler } from "../utils/errorHandler";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const deleteCloudinaryImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary image deleted:", result);
    return result;
  } catch (error) {
    console.error("Error deleting Cloudinary image:", error);
    throw new ErrorHandler("Failed to delete image from Cloudinary", 500);
  }
};
export default cloudinary;

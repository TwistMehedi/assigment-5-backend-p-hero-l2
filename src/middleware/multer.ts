import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: any, file: any): Promise<Options["params"]> => {
    const originalName = file?.originalname || "unknown";

    const cleanFileName = originalName
      .split(".")[0]
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 50);

    let folderName = "movie-portal/others";
    const mimeType = file?.mimetype || "";

    if (mimeType.startsWith("image")) {
      folderName = "movie-portal/images";
    } else if (mimeType.startsWith("video")) {
      folderName = "movie-portal/movies";
    } else if (mimeType === "application/pdf") {
      folderName = "movie-portal/pdf";
    }

    const publicId = `${Date.now()}-${cleanFileName}`;

    return {
      folder: folderName,
      public_id: publicId,
      resource_type: "auto",
    } as any;
  },
});

const upload = multer({
  storage,
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo",
      "application/pdf",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image, video, and PDF allowed") as any, false);
    }
  },
});

export default upload;

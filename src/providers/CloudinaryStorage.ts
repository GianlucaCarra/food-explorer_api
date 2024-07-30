import { Readable } from "stream";
import AppError from "../utils/AppError";
const cloudinary = require("cloudinary").v2;

interface IResult {
  public_id: string;
  secure_url: string;
}

class CloudinaryStorage {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
  }

  private trySaveFile(fileStream: Readable): Promise<IResult> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "uploads-food-explorer" },
        (error: Error | null, result: IResult | undefined) => {
          if (error) {
            reject(new AppError(error.message, 404));
          } else if (result) {
            resolve(result);
          } else {
            reject(new AppError("Unexpected error: result is undefined"));
          }
        }
      ).end(fileStream);
    });
  }

  async saveFile(fileStream: Readable): Promise<{ publicId: string; imageUrl: string } | null> {
    try {
      const result = await this.trySaveFile(fileStream);
      return {
        publicId: result.public_id,
        imageUrl: result.secure_url,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 404);
      } else {
        throw new AppError("An unknown error occurred", 404);
      }
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, 404);
      } else {
        throw new AppError("An unknown error occurred", 404);
      }
    }
  }
}

export default CloudinaryStorage;

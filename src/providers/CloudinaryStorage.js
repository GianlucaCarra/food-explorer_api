const cloudinary = require("cloudinary").v2;

class CloudinaryStorage {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
  }

  async saveFile(fileStream) {
    try {
      return await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: "uploads-food-explorer"
        }, (error, result) => {
          if (error) {
            console.error("Error uploading in cloud:", error);

            reject(error);
          } else {
            resolve({ publicId: result.public_id, imageUrl: result.secure_url });
          }
        }).end(fileStream);
      });
    } catch (error) {
      console.error("Error uploading in cloud:", error);

      throw error;
    }
  }
  
  async deleteFile(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CloudinaryStorage;

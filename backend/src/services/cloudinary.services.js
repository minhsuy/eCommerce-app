import cloudinary from "../config/cloudinary.js";
export const uploadImageService = async (files) => {
  const result = files.map((file) => {
    return cloudinary.uploader.upload(file.path, {
      folder: "products",
    });
  });

  return Promise.all(result);
};

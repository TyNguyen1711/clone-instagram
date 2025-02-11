import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadVideoToCloudinary = async (file) => {
  console.log("File: ", file);

  return new Promise((resolve, reject) => {
    const readableStream = new Readable();
    readableStream.push(file.buffer);
    readableStream.push(null); // Kết thúc stream

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "posts/videos" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    readableStream.pipe(uploadStream);
  });
};

export default uploadVideoToCloudinary;

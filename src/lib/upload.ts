import type { MultipartFile } from "@fastify/multipart";
import type { FileData } from "../types/assets.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { mimeTypeByFormat } from "../types/assets.js";

cloudinary.config();

export async function processFile({
  file,
  mimetype,
}: MultipartFile): Promise<FileData> {
  const result: UploadApiResponse = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: process.env.CLOUDINARY_FOLDER ?? "pote-dev" },
      (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result);
      },
    );
    file.pipe(stream);
  });

  return {
    url: result.secure_url,
    size: result.bytes,
    mime_type:
      mimeTypeByFormat[result.format] ?? mimetype ?? "application/octet-stream",
    width: result.width ?? null,
    height: result.height ?? null,
  };
}

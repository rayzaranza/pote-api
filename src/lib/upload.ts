import type { MultipartFile } from "@fastify/multipart";
import type { AssetType, FileData } from "../types/assets.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { cloudinaryResourceType, mimeTypeByFormat } from "../types/assets.js";
import { AppError } from "./errors.js";

cloudinary.config();

export async function processFile(
  { file, mimetype }: MultipartFile,
  type: AssetType,
): Promise<FileData> {
  try {
    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_FOLDER ?? "pote-dev",
          resource_type: cloudinaryResourceType[type],
        },
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
        mimeTypeByFormat[result.format] ??
        mimetype ??
        "application/octet-stream",
      width: result.width ?? null,
      height: result.height ?? null,
      storage_id: result.public_id,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao enviar arquivo.", 500);
  }
}

export async function deleteFile(storageId: string) {
  try {
    await cloudinary.uploader.destroy(storageId);
  } catch (error) {
    console.error("Erro interno ao excluir arquivo do Cloudinary.", error);
  }
}

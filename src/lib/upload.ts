import type { MultipartFile } from "@fastify/multipart";
import type { FileData } from "../types/assets.js";

export async function processFile(file: MultipartFile): Promise<FileData> {
  return {
    url: "https://www.placekittens.com/300/300",
    size: 1024,
    mime_type: file.mimetype || "application/octet-stream",
    width: 300,
    height: 300,
  };
}

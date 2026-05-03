import { type MultipartFile } from "@fastify/multipart";
import { z } from "zod";

export const AssetTypeSchema = z.enum(["image", "video", "3d", "document"]);
export type AssetType = z.infer<typeof AssetTypeSchema>;

export const AssetInsertSchema = z.object({
  name: z.string().min(2),
  description: z.string().nullish(),
  type: AssetTypeSchema,
  collection_id: z.uuid().nullish(),
});

export interface FileData {
  url: string;
  size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
}

export type AssetInsert = z.infer<typeof AssetInsertSchema> & FileData;

export interface Asset extends FileData {
  id: string;
  name: string;
  description: string | null;
  type: AssetType;
  created_at: string;
  updated_at: string;
  collection_id: string | null;
  user_id: string;
}

export type PublicAsset = Omit<Asset, "user_id">;

export interface AssetUploadBody {
  file: MultipartFile;
  name: string;
  type: string;
  description?: string;
  collection_id?: string;
}

export const AssetByIdSchema = z.object({ assetId: z.uuid() });

export const AssetUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullish(),
  type: AssetTypeSchema.optional(),
  collection_id: z.uuid().nullish(),
});

export type AssetUpdate = z.infer<typeof AssetUpdateSchema>;

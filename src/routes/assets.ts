import type { FastifyInstance } from "fastify/types/instance.js";
import {
  createAsset,
  deleteAsset,
  editAsset,
  getAssetById,
  getAssets,
} from "../services/assets.js";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import { ValidationError } from "../lib/errors.js";
import {
  AssetByIdSchema,
  AssetInsertSchema,
  AssetUpdateSchema,
  FileData,
} from "../types/assets.js";
import { processFile } from "../lib/upload.js";
import { getField } from "../lib/multipart.js";

export async function assetsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get("/", async (request, reply) => {
    const { userId } = request.user;
    const { assets } = await getAssets(userId);
    reply.send({ assets });
  });

  server.get(
    "/:assetId",
    { schema: { params: AssetByIdSchema } },
    async (request, reply) => {
      const { assetId } = request.params;
      const { userId } = request.user;
      const { asset } = await getAssetById(assetId, userId);
      reply.send({ asset });
    },
  );

  server.post("/", async (request, reply) => {
    const data = await request.file();
    if (!data) throw new ValidationError("Nenhum arquivo enviado.");

    const fields = AssetInsertSchema.parse({
      name: getField(data, "name"),
      type: getField(data, "type"),
      description: getField(data, "description"),
      collection_id: getField(data, "collection_id"),
    });

    const fileData = await processFile(data);
    const { userId } = request.user;
    const { asset } = await createAsset({ ...fields, ...fileData }, userId);

    reply.code(201).send({ asset });
  });

  server.patch(
    "/:assetId",
    { schema: { params: AssetByIdSchema } },
    async (request, reply) => {
      const data = await request.file();

      const assetData = AssetUpdateSchema.parse({
        name: getField(data, "name"),
        type: getField(data, "type"),
        description: getField(data, "description"),
        collection_id: getField(data, "collection_id"),
      });

      let fileData: FileData | undefined;

      if (data) {
        fileData = await processFile(data);
      }

      const { userId } = request.user;
      const { assetId } = request.params;
      const { asset } = await editAsset(
        { assetData, fileData },
        assetId,
        userId,
      );
      reply.send({ asset });
    },
  );

  server.delete(
    "/:assetId",
    { schema: { params: AssetByIdSchema } },
    async (request, reply) => {
      const { assetId } = request.params;
      const { userId } = request.user;
      await deleteAsset(assetId, userId);
      reply.code(204).send();
    },
  );
}

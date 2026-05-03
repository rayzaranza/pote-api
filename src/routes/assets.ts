import type { FastifyInstance } from "fastify/types/instance.js";
import { createAsset, getAssetById, getAssets } from "../services/assets.js";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import { ValidationError } from "../lib/errors.js";
import {
  AssetByIdSchema,
  AssetInsertSchema,
  type AssetUploadBody,
} from "../types/assets.js";
import { processFile } from "../lib/upload.js";

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
    const { name, file, type, description, collection_id } =
      request.body as AssetUploadBody;

    if (!file) throw new ValidationError("Nenhum arquivo enviado");

    const fields = AssetInsertSchema.parse({
      name,
      type,
      description,
      collection_id,
    });

    const fileData = await processFile(file);
    const { userId } = request.user;
    const { asset } = await createAsset({ ...fields, ...fileData }, userId);

    reply.code(201).send({ asset });
  });
}

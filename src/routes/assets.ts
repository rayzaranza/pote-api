import type { FastifyInstance } from "fastify/types/instance.js";
import { createAsset, getAssets } from "../services/assets.js";
import type { ZodTypeProvider } from "@fastify/type-provider-zod";
import { ValidationError } from "../lib/errors.js";
import { AssetInsertSchema, type AssetUploadBody } from "../types/assets.js";
import { processFile } from "../lib/upload.js";

export async function assetsRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get("/", async (request, reply) => {
    const { assets } = await getAssets(request.user.userId);
    reply.send({ assets });
  });

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

    const { asset } = await createAsset(
      { ...fields, ...fileData },
      request.user.userId,
    );

    reply.code(201).send({ asset });
  });
}

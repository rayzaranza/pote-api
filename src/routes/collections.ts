import { type FastifyInstance } from "fastify";
import { createCollection, getCollections } from "../services/collections.js";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import { CollectionInsertSchema } from "../types/collections.js";

export async function collectionRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get("/", async (request, reply) => {
    const { userId } = request.user;
    const { collections } = await getCollections(userId);
    reply.send({ collections });
  });

  server.post(
    "/",
    { schema: { body: CollectionInsertSchema } },
    async (request, reply) => {
      const { name, description } = request.body;
      const { userId } = request.user;
      const { collection } = await createCollection({
        name,
        description,
        userId,
      });
      reply.code(201).send({ collection });
    },
  );
}

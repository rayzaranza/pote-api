import { type FastifyInstance } from "fastify";
import {
  createCollection,
  getCollections,
  getCollectionById,
  editCollection,
  deleteCollection,
} from "../services/collections.js";
import { ZodTypeProvider } from "@fastify/type-provider-zod";
import {
  CollectionByIdSchema,
  CollectionInsertSchema,
  CollectionUpdateSchema,
} from "../types/collections.js";

export async function collectionRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get("/", async (request, reply) => {
    const { userId } = request.user;
    const { collections } = await getCollections(userId);
    reply.send({ collections });
  });

  server.get(
    "/:collectionId",
    { schema: { params: CollectionByIdSchema } },
    async (request, reply) => {
      const { userId } = request.user;
      const { collectionId } = request.params;
      const { collection } = await getCollectionById(collectionId, userId);
      reply.send({ collection });
    },
  );

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

  server.patch(
    "/:collectionId",
    { schema: { params: CollectionByIdSchema, body: CollectionUpdateSchema } },
    async (request, reply) => {
      const { userId } = request.user;
      const { collectionId } = request.params;
      const { name, description } = request.body;
      const { collection } = await editCollection(
        { name, description, userId },
        collectionId,
      );
      reply.send({ collection });
    },
  );

  server.delete(
    "/:collectionId",
    { schema: { params: CollectionByIdSchema } },
    async (request, reply) => {
      const { collectionId } = request.params;
      const { userId } = request.user;
      await deleteCollection(collectionId, userId);
      reply.code(204).send();
    },
  );
}

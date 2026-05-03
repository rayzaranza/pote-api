import { type FastifyInstance } from "fastify";

export async function collectionRoutes(app: FastifyInstance) {
  app.get("/", async (_request, reply) => {
    reply.send({ eita: "eita" });
  });
}

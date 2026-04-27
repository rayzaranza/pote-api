import { type FastifyInstance } from "fastify";
import { usersRoute } from "./users.js";

export async function routes(app: FastifyInstance) {
  app.register(usersRoute, { prefix: "/users" });
}

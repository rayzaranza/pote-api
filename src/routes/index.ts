import { type FastifyInstance } from "fastify";
import { usersRoute } from "./users.js";
import { collectionRoutes } from "./collections.js";
import { assetsRoutes } from "./assets.js";
import { authPlugin } from "../plugins/auth.js";

export async function routes(app: FastifyInstance) {
  await app.register(usersRoute, { prefix: "/users" });

  await app.register(async (protectedApp) => {
    await protectedApp.register(authPlugin);
    await protectedApp.register(collectionRoutes, { prefix: "/collections" });
    await protectedApp.register(assetsRoutes, { prefix: "/assets" });
  });
}

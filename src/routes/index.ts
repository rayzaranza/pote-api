import { type FastifyInstance } from "fastify";
import { authPlugin } from "../plugins/auth.js";

import { authRoutes } from "./auth.js";
import { usersRoutes } from "./users.js";
import { collectionsRoutes } from "./collections.js";
import { assetsRoutes } from "./assets.js";

export async function routes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: "/auth" });

  await app.register(async (protectedApp) => {
    await protectedApp.register(authPlugin);
    await protectedApp.register(collectionsRoutes, { prefix: "/collections" });
    await protectedApp.register(assetsRoutes, { prefix: "/assets" });
    await protectedApp.register(usersRoutes, { prefix: "/users" });
  });
}

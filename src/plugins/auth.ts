import { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { verifyToken } from "../lib/jwt.js";
import { UnauthorizedError } from "../lib/errors.js";

export const authPlugin: FastifyPluginAsync = fastifyPlugin(async (app) => {
  app.addHook("onRequest", async (request) => {
    console.log("eita");
    const PREFIX = "Bearer ";
    const header = request.headers.authorization;

    if (!header?.startsWith(PREFIX)) {
      throw new UnauthorizedError("Sem token de autenticação.");
    }

    const token = header.slice(PREFIX.length);

    try {
      request.user = verifyToken(token);
    } catch {
      throw new UnauthorizedError("Token de autenticação inválido.");
    }
  });
});

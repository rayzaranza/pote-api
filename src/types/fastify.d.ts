import { JwtPayload } from "../lib/jwt.ts";

declare module "fastify" {
  interface FastifyRequest {
    user: JwtPayload;
  }
}

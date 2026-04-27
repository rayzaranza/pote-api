import { type FastifyInstance } from "fastify";
import { createUser } from "../services/users.js";
import type { UserInsert } from "../types/users.js";
import { UserInsertSchema } from "../types/users.js";
import { type ZodTypeProvider } from "@fastify/type-provider-zod";

export async function usersRoute(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post<{ Body: UserInsert }>(
    "/register",
    { schema: UserInsertSchema },
    async (request, reply) => {
      const { name, email, password } = request.body;
      const { user, token } = await createUser({ name, email, password });
      reply.code(201).send({ user, token });
    },
  );
}

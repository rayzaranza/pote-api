import { type FastifyInstance } from "fastify";
import { createUser, login } from "../services/users.js";
import { UserInsertSchema, UserLoginSchema } from "../types/users.js";
import { type ZodTypeProvider } from "@fastify/type-provider-zod";

export async function usersRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.post(
    "/register",
    { schema: { body: UserInsertSchema } },
    async (request, reply) => {
      const { name, email, password } = request.body;
      const { user, token } = await createUser({ name, email, password });
      reply.code(201).send({ user, token });
    },
  );

  server.post(
    "/login",
    { schema: { body: UserLoginSchema } },
    async (request, reply) => {
      const { email, password } = request.body;
      const { user, token } = await login({ email, password });
      reply.code(200).send({ user, token });
    },
  );
}

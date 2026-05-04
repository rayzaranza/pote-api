import { type FastifyInstance } from "fastify";
import { editUser, getUserById } from "../services/users.js";
import { type ZodTypeProvider } from "@fastify/type-provider-zod";
import { UserUpdateSchema } from "../types/users.js";

export async function usersRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<ZodTypeProvider>();

  server.get("/me", async (request, reply) => {
    const { userId } = request.user;
    const { user } = await getUserById(userId);
    reply.send({ user });
  });

  server.patch(
    "/me",
    { schema: { body: UserUpdateSchema } },
    async (request, reply) => {
      const { name, email, password } = request.body;
      const { userId } = request.user;
      const { user } = await editUser({ name, email, password }, userId);
      reply.send({ user });
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

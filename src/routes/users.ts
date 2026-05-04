import { type FastifyInstance } from "fastify";
import { editUser, getUserById } from "../services/users.js";
import { type ZodTypeProvider } from "@fastify/type-provider-zod";
import { UserUpdateSchema } from "../types/users.js";
import { processFile } from "../lib/upload.js";
import { ValidationError } from "../lib/errors.js";

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

  server.put("/me/avatar", async (request, reply) => {
    const file = await request.file();
    if (!file) {
      throw new ValidationError("Nenhuma imagem enviada.");
    }
    const { url } = await processFile(file, "image");
    const { userId } = request.user;
    const { user } = await editUser({ avatar_url: url }, userId);
    reply.send({ user });
  });
}

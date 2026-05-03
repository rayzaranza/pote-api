import Fastify, { type FastifyError } from "fastify";
import { routes } from "./routes/index.js";
import { AppError } from "./lib/errors.js";
import {
  serializerCompiler,
  validatorCompiler,
} from "@fastify/type-provider-zod";
import multipart from "@fastify/multipart";

export const app = Fastify({ logger: true });

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(multipart, { attachFieldsToBody: "keyValues" });

app.setErrorHandler((error: FastifyError, _request, reply) => {
  if (error instanceof AppError) {
    return reply
      .code(error.statusCode)
      .send({ error: error.message, code: error.statusCode });
  }

  if (error.validation) {
    return reply.status(400).send({
      error: "Erro de validação",
      message: error.message,
      ...(process.env.NODE_ENV !== "production" && {
        details: error.validation,
      }),
    });
  }

  app.log.error(error);
  reply.code(500).send({ error: "Error interno de servidor." });
});

app.register(routes, { prefix: "/api" });

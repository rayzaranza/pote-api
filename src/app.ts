import Fastify from "fastify";
import { routes } from "./routes/index.js";

export const app = Fastify({ logger: true });

app.register(routes, { prefix: "/api" });

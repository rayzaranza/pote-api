import { app } from "./app";

async function server() {
  try {
    await app.listen({ port: 3000 });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

server();

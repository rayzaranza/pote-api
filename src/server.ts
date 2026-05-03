import { app } from "./app.js";
import { pool } from "./database/pool.js";
import dotenv from "dotenv";

dotenv.config();

app.listen(
  { port: Number(process.env.PORT) || 3000, host: "0.0.0.0" },
  (error) => {
    if (error) {
      app.log.error(error);
      process.exit(1);
    }
  },
);

async function shutdown() {
  app.log.info("Encerrando servidor...");
  await pool.end();
  await app.close();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

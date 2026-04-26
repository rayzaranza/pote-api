import { app } from "./app.js";
import { pool } from "./database/pool.js";

app.listen({ port: 3000, host: "0.0.0.0" }, (error, address) => {
  if (error) {
    app.log.error(error);
    process.exit(1);
  }
  console.log(`API rodando  em ${address}`);
});

process.on("SIGTERM", async () => {
  await pool.end();
  await app.close();
  process.exit(0);
});

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

process.on("SIGTERM", async () => {
  await pool.end();
  await app.close();
  process.exit(0);
});

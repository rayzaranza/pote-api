import { pool } from "../database/pool.js";
import { AppError } from "../lib/errors.js";
import type { Collection, CollectionInsert } from "../types/collections.js";

export async function createCollection({
  name,
  description,
  userId,
}: CollectionInsert) {
  let collection: Collection | undefined;

  try {
    const { rows } = await pool.query<Collection>(
      `INSERT INTO collections (name, description, user_id) 
      VALUES ($1, $2, $3)
      RETURNING id, name, description, created_at, updated_at;`,
      [name, description, userId],
    );
    collection = rows[0];
  } catch (error) {
    throw new AppError("Erro interno ao criar coleção.", 500);
  }

  if (!collection) {
    throw new AppError("Erro interno ao criar coleção.", 500);
  }

  return { collection };
}

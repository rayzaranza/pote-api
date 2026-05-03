import { pool } from "../database/pool.js";
import { AppError } from "../lib/errors.js";
import type { PublicAsset, AssetInsert } from "../types/assets.js";

export async function createAsset(asset: AssetInsert, userId: string) {
  try {
    const { rows } = await pool.query<PublicAsset>(
      `INSERT INTO assets (
          name, 
          description, 
          url, 
          type, 
          mime_type, 
          size, 
          width, 
          height, 
          collection_id, 
          user_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING 
          id,
          name, 
          description, 
          url, 
          type, 
          mime_type, 
          size, 
          width, 
          height, 
          created_at,
          updated_at,
          collection_id;`,
      [
        asset.name,
        asset.description,
        asset.url,
        asset.type,
        asset.mime_type,
        asset.size,
        asset.width,
        asset.height,
        asset.collection_id,
        userId,
      ],
    );

    if (!rows[0]) {
      throw new AppError("Erro interno ao criar arquivo.", 500);
    }
    return { asset: rows[0] };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao criar arquivo.", 500);
  }
}

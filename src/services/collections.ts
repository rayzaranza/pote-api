import { pool } from "../database/pool.js";
import { AppError, NotFoundError } from "../lib/errors.js";
import type {
  Collection,
  CollectionInsert,
  CollectionUpdate,
  PublicCollection,
} from "../types/collections.js";

export async function createCollection({
  name,
  description,
  userId,
}: CollectionInsert) {
  try {
    const { rows } = await pool.query<Collection>(
      `INSERT INTO collections (name, description, user_id) 
      VALUES ($1, $2, $3)
      RETURNING id, name, description, created_at, updated_at;`,
      [name, description, userId],
    );

    if (!rows[0]) {
      throw new AppError("Erro interno ao criar coleção.", 500);
    }

    return { collection: rows[0] };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao criar coleção.", 500);
  }
}

export async function getCollections(userId: string) {
  try {
    const { rows } = await pool.query<PublicCollection>(
      `SELECT id, name, description, created_at, updated_at 
       FROM collections 
       WHERE user_id = $1
       ORDER BY created_at DESC;`,
      [userId],
    );

    return { collections: rows };
  } catch (error) {
    throw new AppError("Erro interno ao listar coleções.", 500);
  }
}

export async function getCollectionById(collectionId: string, userId: string) {
  try {
    const { rows } = await pool.query<PublicCollection>(
      `SELECT id, name, description, created_at, updated_at
       FROM collections
       WHERE id = $1 AND user_id = $2;`,
      [collectionId, userId],
    );

    if (!rows[0]) {
      throw new NotFoundError("Nenhuma coleção encontrada com esse id.");
    }

    return { collection: rows[0] };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao retornar coleção.", 500);
  }
}

export async function editCollection(
  { name, description, userId }: CollectionUpdate,
  collectionId: string,
) {
  try {
    const { rows } = await pool.query<PublicCollection>(
      `UPDATE collections 
       SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          updated_at = now()
       WHERE 
          id = $3 AND user_id = $4
       RETURNING 
          id, name, description, created_at, updated_at;`,
      [name, description, collectionId, userId],
    );

    if (!rows[0]) {
      throw new NotFoundError("Nenhuma coleção encontrada com esse id.");
    }

    return { collection: rows[0] };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao editar coleção.", 500);
  }
}

export async function deleteCollection(collectionId: string, userId: string) {
  try {
    const { rowCount } = await pool.query<PublicCollection>(
      `DELETE FROM collections
       WHERE id = $1 AND user_id = $2;`,
      [collectionId, userId],
    );

    if (rowCount === 0) {
      throw new NotFoundError("Nenhuma coleção encontrada com esse id.");
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao excluir coleção.", 500);
  }
}

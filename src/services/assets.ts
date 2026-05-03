import { pool } from "../database/pool.js";
import { AppError, NotFoundError } from "../lib/errors.js";
import type {
  PublicAsset,
  AssetInsert,
  AssetUpdate,
  FileData,
} from "../types/assets.js";

export async function getAssets(userId: string, collectionId?: string) {
  try {
    const { rows } = await pool.query<PublicAsset>(
      `SELECT 
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
          collection_id
        FROM assets
        WHERE user_id = $1 AND ($2::uuid IS NULL OR collection_id = $2)
        ORDER BY created_at DESC;`,
      [userId, collectionId ?? null],
    );

    return {
      assets: rows.map((row) => ({ ...row, size: Number(row.size) })),
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao retornar arquivos.", 500);
  }
}

export async function getAssetById(assetId: string, userId: string) {
  try {
    const { rows } = await pool.query<PublicAsset>(
      `SELECT 
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
          collection_id
        FROM assets
        WHERE id = $1 AND user_id = $2`,
      [assetId, userId],
    );

    const asset = rows[0];
    if (!asset) {
      throw new NotFoundError("Nenhum arquivo encontrado com esse id.");
    }

    return {
      asset: { ...asset, size: Number(asset.size) },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao retornar arquivos.", 500);
  }
}

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
    const data = rows[0];
    return { asset: { ...data, size: Number(data.size) } };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao criar arquivo.", 500);
  }
}

export async function editAsset(
  {
    assetData,
    fileData,
  }: { assetData: AssetUpdate; fileData?: FileData | undefined },
  assetId: string,
  userId: string,
) {
  try {
    const { rows } = await pool.query(
      `UPDATE assets
       SET
          name = COALESCE($1, name), 
          description = COALESCE($2, description), 
          url = COALESCE($3, url), 
          type = COALESCE($4, type), 
          mime_type = COALESCE($5, mime_type), 
          size = COALESCE($6, size),  
          width = COALESCE($7, width), 
          height = COALESCE($8, height), 
          collection_id = COALESCE($9, collection_id),
          updated_at = now()
        WHERE
          id = $10 AND user_id = $11
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
        assetData.name,
        assetData.description,
        fileData?.url,
        assetData.type,
        fileData?.mime_type,
        fileData?.size,
        fileData?.width,
        fileData?.height,
        assetData.collection_id,
        assetId,
        userId,
      ],
    );

    const asset = rows[0];

    if (!asset) {
      throw new NotFoundError("Nenhum arquivo encontrado com esse id.");
    }

    return { asset: { ...asset, size: Number(asset.size) } };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao editar arquivo.", 500);
  }
}

export async function deleteAsset(assetId: string, userId: string) {
  try {
    const { rowCount } = await pool.query(
      `DELETE FROM assets 
       WHERE id = $1 AND user_id = $2;`,
      [assetId, userId],
    );

    if (rowCount === 0) {
      throw new NotFoundError("Nenhum arquivo encontrado com esse id.");
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao excluir arquivo.", 500);
  }
}

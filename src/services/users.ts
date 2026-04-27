import { pool } from "../database/pool.js";
import type { PublicUser, UserInsert } from "../types/users.js";
import { hash } from "argon2";
import { ConflictError, AppError } from "../lib/errors.js";
import { DatabaseError } from "pg";
import { signToken } from "../lib/jwt.js";

export async function createUser({ name, email, password }: UserInsert) {
  let password_hash: string;
  try {
    password_hash = await hash(password);
  } catch {
    throw new AppError("Erro interno ao criptografar senha.", 500);
  }

  let user: PublicUser | undefined;
  try {
    const { rows } = await pool.query<PublicUser>(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, avatar_url, created_at, updated_at;`,
      [name, email, password_hash],
    );

    user = rows[0];
  } catch (error: unknown) {
    if (error instanceof DatabaseError && error.code === "23505") {
      throw new ConflictError("Esse email já está sendo usado.");
    }
    throw new AppError("Erro interno ao criar conta.", 500);
  }

  if (!user) {
    throw new AppError("Error interno ao criar conta.", 500);
  }

  const token = signToken({ userId: user.id });
  return { user, token };
}

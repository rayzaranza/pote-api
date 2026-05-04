import { pool } from "../database/pool.js";
import type {
  PublicUser,
  User,
  UserInsert,
  UserLogin,
  UserUpdate,
} from "../types/users.js";
import { hash, verify } from "argon2";
import { ConflictError, AppError, UnauthorizedError } from "../lib/errors.js";
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

export async function login({ email, password }: UserLogin) {
  let user: User | undefined;

  try {
    const { rows } = await pool.query<User>(
      `SELECT * FROM users WHERE email = $1;`,
      [email],
    );
    user = rows[0];
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Erro interno ao fazer login.", 500);
  }

  if (!user) {
    throw new UnauthorizedError("Email ou senha inválidos.");
  }

  let passwordMatches: boolean;
  try {
    passwordMatches = await verify(user.password_hash, password);
  } catch {
    throw new AppError("Erro interno ao fazer login.", 500);
  }

  if (!passwordMatches) {
    throw new UnauthorizedError("Email ou senha inválidos.");
  }

  const { password_hash, ...publicUser } = user;
  const token = signToken({ userId: user.id });

  return { user: publicUser, token };
}

export async function getUserById(userId: string) {
  try {
    const { rows } = await pool.query<PublicUser>(
      `SELECT id, name, email, avatar_url, created_at, updated_at
       FROM users
       WHERE id = $1;`,
      [userId],
    );

    const user = rows[0];
    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    return { user };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Erro interno ao retornar usuário.", 500);
  }
}

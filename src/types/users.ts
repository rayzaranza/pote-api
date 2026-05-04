import { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type PublicUser = Omit<User, "password_hash">;

export const UserInsertSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export type UserInsert = z.infer<typeof UserInsertSchema>;

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type UserLogin = z.infer<typeof UserLoginSchema>;

export const UserUpdateSchema = z
  .object({
    name: z.string().min(2).optional(),
    email: z.email().nullish(),
    password: z.string().min(6).optional(),
  })
  .refine(
    ({ name, email, password }) =>
      name !== undefined || email !== undefined || password !== undefined,
    {
      message: "Pelo menos um campo deve ser fornecido.",
    },
  );

export type UserUpdate = z.infer<typeof UserUpdateSchema> & {
  avatar_url?: string | null;
};

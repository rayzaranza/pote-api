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

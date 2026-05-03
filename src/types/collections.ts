import { z } from "zod";

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type PublicCollection = Omit<Collection, "user_id">;

export const CollectionInsertSchema = z.object({
  name: z.string().min(2),
  description: z.string().nullable().optional(),
});

export type CollectionInsertBody = z.infer<typeof CollectionInsertSchema>;

export type CollectionInsert = CollectionInsertBody & { userId: string };

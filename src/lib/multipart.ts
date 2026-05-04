import type { MultipartFile } from "@fastify/multipart";

export function getField(data: MultipartFile | undefined | null, name: string) {
  if (!data) return undefined;

  const field = data.fields[name];

  if (!field || Array.isArray(field) || field.type !== "field") {
    return undefined;
  }

  return field.value;
}

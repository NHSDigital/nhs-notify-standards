import { z } from "zod";

export function DomainBase<T extends string>(
  type: T,
): z.ZodObject<{ id: z.core.$ZodBranded<z.ZodString, T> }> {
  const idType = z
    .string()
    .brand<T>(type)
    .meta({
      title: `${type} ID`,
      description: `Unique identifier for the ${type}`,
      examples: ["1y3q9v1zzzz_1y3q9v1zzzy"],
    }) as z.core.$ZodBranded<z.ZodString, T>;

  return z.object({
    id: idType,
  });
}

export const $Version = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/)
  .brand("Version");
export type Version = z.infer<typeof $Version>;

export const $Environment = z.string().meta({
  title: "Environment",
  description: "The environment in which the configuration has effect",
  examples: ["dev", "int", "prod"],
});

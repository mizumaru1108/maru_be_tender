import { z } from 'zod';
export const ImagePayload = z.object({
  base64Data: z.string(),
  imageName: z.string().optional(),
  imagePrefix: z.string().optional(),
  fullName: z.string(),
  imageExtension: z.string().regex(/^[.][^.]+/, "Must start with '.'"),
  currentPhoto: z.string().optional(),
});
export type ImagePayload = z.infer<typeof ImagePayload>;

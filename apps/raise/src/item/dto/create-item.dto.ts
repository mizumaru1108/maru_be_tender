import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

class Image {
  id: string;
  url: string;
}

export const ImagePayload = z.object({
  base64Data: z.string(),
  imageName: z.string().optional(),
  imagePrefix: z.string().optional(),
  fullName: z.string(),
  imageExtension: z.string().regex(/^[.][^.]+/, "Must start with '.'"),
  currentPhoto: z.string().optional(),
});
export type ImagePayload = z.infer<typeof ImagePayload>;

export const CreateItemDto = z.object({
  organizationId: z.string(),
  category: z.string(),
  defaultPrice: z.string(),
  name: z.string(),
  userId: z.string(),
  projectId: z.string().optional(),
  totalNeed: z.string(),
  description: z.string(),
  images: z.array(ImagePayload),
});
export type CreateItemDto = z.infer<typeof CreateItemDto>;

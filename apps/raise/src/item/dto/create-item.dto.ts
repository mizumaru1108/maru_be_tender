import { z } from 'zod';
import { ImagePayload } from '../../commons/dtos/image-payload.dto';

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

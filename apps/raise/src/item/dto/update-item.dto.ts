import { CreateItemDto } from './create-item.dto';
import { z } from 'zod';
export const UpdateItemDto = CreateItemDto.partial().strict();
export type UpdateItemDto = z.infer<typeof UpdateItemDto>;

import { z } from 'zod';
import { ImagePayload } from '../../commons/dtos/image-payload.dto';

export const DonorApplyVendorDto = z.object({
  email: z.string().email(),
  name: z.string(),
  channels: z.string(),
  vendorId: z.string().min(1),
  images: z.array(ImagePayload),
});
export type DonorApplyVendorDto = z.infer<typeof DonorApplyVendorDto>;

import { z } from 'zod';
import { ImagePayload } from '../../commons/dtos/image-payload.dto';

export const DonorApplyVendorDto = z.object({
  organizationId: z.string().min(1), // not really needed, we just need it to assign image to the path
  vendorId: z.string().min(1),
  name: z.string(),
  channels: z.string(),
  images: z.array(ImagePayload),
});
export type DonorApplyVendorDto = z.infer<typeof DonorApplyVendorDto>;

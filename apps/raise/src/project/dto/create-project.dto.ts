import { z } from 'zod';
import { ImagePayload } from '../../commons/dtos/image-payload.dto';

export const NearByPlaces = z.object({
  placeType: z.string(),
  name: z.string(),
  distance: z.string(),
});
export type NearByPlaces = z.infer<typeof NearByPlaces>;

export const CreateProjectDto = z.object({
  organizationId: z.string().min(1),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  nearByPlaces: z.array(NearByPlaces),
  location: z.string(),
  diameterSize: z.string(),
  prayerSize: z.string(),
  toiletSize: z.string(),
  hasAc: z.string(),
  hasClassroom: z.string(),
  hasParking: z.string(),
  hasGreenSpace: z.string(),
  images: z.array(ImagePayload),
  hasFemaleSection: z.string(),
});
export type CreateProjectDto = z.infer<typeof CreateProjectDto>;

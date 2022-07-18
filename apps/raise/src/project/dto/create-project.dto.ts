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

// export const CampaignMilestone = z.object({
//   name: z.string(),
//   detail: z.string(),
//   deadline: z.string(),
// });
// export type CampaignMilestone = z.infer<typeof CampaignMilestone>;

export const CreateProjectDto = z.object({
  organizationId: z.string().min(1),
  name: z.string(),
  userId: z.string(),
  // projectId: z.string().optional(),
  // type: z.string(),
  description: z.string(),
  // isMoney: z.string(),
  // methods: z.array(z.string()),
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

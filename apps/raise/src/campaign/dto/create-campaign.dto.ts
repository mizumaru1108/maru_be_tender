import { z } from 'zod';
import { ImagePayload } from '../../commons/dtos/image-payload.dto';

export const CampaignMilestone = z.object({
  name: z.string(),
  detail: z.string(),
  deadline: z.string(),
});
export type CampaignMilestone = z.infer<typeof CampaignMilestone>;

export const CreateCampaignDto = z.object({
  organizationId: z.string().min(1),
  campaignId: z.string().optional(), // should be optional, generated by server(?)
  userId: z.string(),
  campaignName: z.string().min(1),
  campaignType: z.string(),
  projectId: z.string().optional(),
  // type: z.string().optional(),
  description: z.string(),
  isMoney: z.string(),
  methods: z.array(z.string()),
  currencyCode: z.string(),
  amountProgress: z.string(),
  amountTarget: z.string(),
  // coverImage: z.string(),
  // image1: z.string(),
  // image2: z.string(),
  // image3: z.string(),
  // images: z.array(Image);
  images: z.array(ImagePayload),
  milestone: z.array(CampaignMilestone).optional(),
});
export type CreateCampaignDto = z.infer<typeof CreateCampaignDto>;

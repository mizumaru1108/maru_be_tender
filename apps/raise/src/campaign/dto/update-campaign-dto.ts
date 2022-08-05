import { z } from 'zod';

import { CampaignMilestone, ImagePayload } from './create-campaign.dto';

export const UpdateCampaignDto = z.object({
  organizationId: z.string().min(1).optional(),
  campaignId: z.string().optional(),
  userId: z.string().optional(),
  campaignName: z.string().min(1).optional(),
  campaignType: z.string().optional(),
  projectId: z.string().optional(),
  description: z.string().optional(),
  isMoney: z.string().optional(),
  methods: z.array(z.string()).optional(),
  currencyCode: z.string().optional(),
  amountProgress: z.string().optional(),
  amountTarget: z.string().optional(),
  // images: z.array(ImagePayload).optional(),
  // milestone: z.array(CampaignMilestone).optional(),
  isPublished: z.string().optional(),
});
export type UpdateCampaignDto = z.infer<typeof UpdateCampaignDto>;

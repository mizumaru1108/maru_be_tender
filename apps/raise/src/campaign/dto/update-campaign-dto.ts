import { z } from 'zod';

import { CreateCampaignDto } from './create-campaign.dto';

/**
 * partial means using all of the create campaigndto fields but use it as optional,
 * strict means it will only accept from the defined fields, and will not accept any other fields.
 */
export const UpdateCampaignDto = CreateCampaignDto.partial().strict().extend({
  isPublished: z.string().optional(), // extend it becouse it is not in the create campaign dto
});

export type UpdateCampaignDto = z.infer<typeof UpdateCampaignDto>;

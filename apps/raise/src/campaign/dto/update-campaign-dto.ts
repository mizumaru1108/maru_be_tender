import { z } from 'zod';
import { ImagePayload } from '../../commons/dtos/image-payload.dto';

import { CreateCampaignDto } from './create-campaign.dto';

/**
 * partial means using all of the create campaigndto fields but use it as optional,
 * strict means it will only accept from the defined fields, and will not accept any other fields.
 */
export const UpdateCampaignDto = CreateCampaignDto.partial().extend({
  isPublished: z.string().optional(), // extend it becouse it is not in the create campaign dto

  /**
   * extends it because user can choose what image to update
   * maximum file uploaded = 4 (included coverImage)
   * images [0] = coverImage
   * images [1] = image1
   * images [2] = image2
   * images [3] = image3
   *
   * if user didnt want to update, fill the images[i] with empty {}
   */
  images: z
    .array(ImagePayload)
    .optional()
    .transform((val) => {
      if (!val) {
        return {} as any;
      }
      return val;
    }),
});

export type UpdateCampaignDto = z.infer<typeof UpdateCampaignDto>;

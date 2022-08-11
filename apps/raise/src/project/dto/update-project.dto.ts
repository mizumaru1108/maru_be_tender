import { CreateProjectDto } from './create-project.dto';
import { z } from 'zod';
import { ImagePayload } from '../../commons/dtos/image-payload.dto';

export const UpdateProjectDto = CreateProjectDto.partial().extend({
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
export type UpdateProjectDto = z.infer<typeof UpdateProjectDto>;

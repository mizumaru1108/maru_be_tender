import { CreateProjectDto } from './create-project.dto';
import { z } from 'zod';

export const UpdateProjectDto = CreateProjectDto.partial();
export type UpdateProjectDto = z.infer<typeof UpdateProjectDto>;

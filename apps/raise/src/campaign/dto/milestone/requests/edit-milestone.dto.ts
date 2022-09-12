import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DeleteMilestoneDto } from './delete-milestone.dto';
import { UpdateMilestoneDto } from './update-milestone.dto';

export class EditMilestoneDto extends DeleteMilestoneDto {
  @ApiProperty()
  @IsNotEmpty()
  editedMilestone: UpdateMilestoneDto;
}

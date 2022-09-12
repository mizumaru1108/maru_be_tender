import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../../../commons/decorators/validate-object-id.decorator';
import { BaseMilestoneDto } from './base-milestone.dto';
import { CreateMilestoneDto } from './create-milestone.dto';

export class AddMilestoneDto extends BaseMilestoneDto {
  @ApiProperty()
  @IsNotEmpty()
  addedMilestone: CreateMilestoneDto;
}

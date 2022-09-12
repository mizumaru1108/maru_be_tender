import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { BaseMilestoneDto } from './base-milestone.dto';

export class DeleteMilestoneDto extends BaseMilestoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  milestoneId: string;
}

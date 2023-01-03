import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class AppointmentFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['tentative', 'confirmed', 'declined', 'done'], {
    message:
      'Status must be one of tentative, confirmed, declined, done',
  })
  status?: 'tentative' | 'confirmed' | 'declined' | 'done';
}

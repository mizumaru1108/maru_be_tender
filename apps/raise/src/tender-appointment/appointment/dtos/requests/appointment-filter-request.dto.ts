import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { BaseFilterRequest } from '../../../../commons/dtos/base-filter-request.dto';

export class AppointmentFilterRequest extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn(['WAITING_FOR_ACCEPTANCE', 'ACCEPTED', 'REJECTED', 'DONE'], {
    message:
      'Status must be one of WAITING_FOR_ACCEPTANCE, ACCEPTED, REJECTED, DONE',
  })
  status?: 'WAITING_FOR_ACCEPTANCE' | 'ACCEPTED' | 'REJECTED' | 'DONE';
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { GetByIdDto } from '../../../../commons/dtos/get-by-id.dto';

export class SendClosingReportDto extends GetByIdDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  send: boolean;
}

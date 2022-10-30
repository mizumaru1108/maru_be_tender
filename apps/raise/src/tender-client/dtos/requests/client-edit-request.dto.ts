import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { ClientEditRequestFieldDto } from './client-edit-request-field.dto';

export class ClientEditRequestDto {
  @ApiProperty()
  // @IsNotEmptyObject()
  @Type(() => ClientEditRequestFieldDto)
  @ValidateNested()
  newValues: ClientEditRequestFieldDto;
}

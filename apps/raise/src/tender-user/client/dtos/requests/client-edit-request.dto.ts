import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ClientEditRequestFieldDto } from './client-edit-request-field.dto';
import { CreateClientBankInformation } from './create-client-bank-information.dto';

export class ClientEditRequestDto {
  @ApiProperty()
  @Type(() => ClientEditRequestFieldDto)
  @ValidateNested()
  newValues: ClientEditRequestFieldDto;

  @ApiProperty()
  @Type(() => CreateClientBankInformation)
  @ValidateNested({ each: true })
  bank_information: CreateClientBankInformation[];
}

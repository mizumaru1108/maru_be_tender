import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';

export class DonorDonateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  organizationId: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateObjectId({ each: true })
  itemId: string[];
}

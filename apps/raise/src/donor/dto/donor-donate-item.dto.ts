import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';

export class DonorDonateItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  itemId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  qty: number;
}

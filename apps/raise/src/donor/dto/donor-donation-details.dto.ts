import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
} from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';

export class DonorDonationDetailsDto {
  /**
   * Type of donations
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  @IsIn(['campaign', 'item', 'project'])
  donationType: string;

  /**
   * Optional (only if donationType is Item)
   * Make it as array, in case donor can donate multiple items
   * and apply validation from dto because there's possibility of qty props
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString() // if exist value should be string
  @IsNotEmpty() // if exist value should not be empty
  @ValidateObjectId()
  itemId: string;

  /**
   * Optional (only if donationType is Item)
   * amount of item donated, to calculate total amount (fetched item price * qty)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  qty: number;

  /**
   * Optional (only if donationType is Project)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  projectId: string;

  /**
   * Optional (only if donationType is campaign)
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  campaignId: string;

  /**
   * if it wasn't item, then it's campaign or project
   * so added the amount of donation, rather than fetch
   * from item
   */
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  donationAmount: number;
}

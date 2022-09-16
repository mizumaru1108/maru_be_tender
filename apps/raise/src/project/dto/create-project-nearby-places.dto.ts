import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CoordiateLocation } from '../../commons/dtos/location.dto';

export class CreateProjectNearbyPlacesDto {
  /**
   * place type (mosque/mall/school/hospital)
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  placeType: string;

  /**
   * name of the place
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * Description
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * distance unit (500, 1000, 1500, 2000)
   */
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  distance: number;

  /**
   * unit distance in (meter, km)
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unitDistance: string;

  /**
   * Coordinates
   */
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordiateLocation)
  coordinates?: CoordiateLocation;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsIn,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';
import { CoordiateLocation } from '../../commons/dtos/location.dto';
import { ProjectNearbyPlaces } from '../schema/project-nearby-places';

export class ProjectCreateUpdateBaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  operatorUserId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CoordiateLocation)
  coordinate: CoordiateLocation;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  diameterSize: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  prayerSize: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  toiletSize: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Y', 'N'], { message: 'hasAc must be Y or N' })
  hasAc: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Y', 'N'], { message: 'hasClassroom must be Y or N' })
  hasClassroom: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Y', 'N'], { message: 'hasParking must be Y or N' })
  hasParking: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Y', 'N'], { message: 'hasGreenSpace must be Y or N' })
  hasGreenSpace: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['Y', 'N'], { message: 'hasFemaleSection must be Y or N' })
  hasFemaleSection: string;

  @ApiPropertyOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectNearbyPlaces)
  nearByPlaces?: ProjectNearbyPlaces[];
}

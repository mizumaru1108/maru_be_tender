import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';
import { PayloadImage } from '../../commons/dtos/payload-image.dto';
import { ProjectNearbyPlaces } from '../schema/project-nearby-places';

export class ProjectCreateDto {
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
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  diameterSize: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  prayerSize: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toiletSize: string;

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

  @ApiProperty()
  @IsArray()
  images: PayloadImage[];

  @ApiPropertyOptional()
  @IsArray()
  nearByPlaces?: ProjectNearbyPlaces[];
}
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdvertisementTypeEnum } from 'src/advertisements/types/enums/advertisement.type.enum';
import { BaseFilterRequest } from 'src/commons/dtos/base-filter-request.dto';

export class AdvertisementFindManyQueryDto extends BaseFilterRequest {}

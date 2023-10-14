import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsUUID,
  IsOptional,
  IsArray,
} from 'class-validator';
import { UserStatusEnum } from '../../types/user_status';

export class UserStatusUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  selectLang?: 'ar' | 'en';

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(UserStatusEnum, {
    message: `Status must be one of ${Object.values(UserStatusEnum).join(
      ', ',
    )}`,
  })
  status: UserStatusEnum;

  @ApiProperty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  user_id: string[];
}

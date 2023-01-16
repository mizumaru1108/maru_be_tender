import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import { UserStatusEnum } from '../../types/user_status';

export class UserStatusUpdateDto {
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
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  user_id: string;
}

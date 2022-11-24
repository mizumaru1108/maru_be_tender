import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma, user } from '@prisma/client';

export class CreateUserResponseDto {
  @ApiProperty()
  createdUser: user;

  @ApiPropertyOptional()
  createdRoles?: Prisma.user_roleUncheckedCreateInput[];
}

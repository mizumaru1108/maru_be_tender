import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class SendAmandementDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  id: string;
}
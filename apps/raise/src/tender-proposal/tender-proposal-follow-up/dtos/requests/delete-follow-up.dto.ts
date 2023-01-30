import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteProposalFollowUpDto {
  @ApiProperty()
  @IsArray()
  @IsString({each: true})
  @IsNotEmpty({each:true})
  id: string[];
}

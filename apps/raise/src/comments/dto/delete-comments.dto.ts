import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { ValidateObjectIdDecorator } from '../../commons/decorators/validate-object-id.decorator';

export class DeleteCommentsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectIdDecorator()
  organizationId: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateObjectIdDecorator({ each: true })
  commentIds: string[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidateObjectId } from '../../commons/decorators/validate-object-id.decorator';

export class GetAllNewCampaignParams {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateObjectId()
  organizationId: string;
}
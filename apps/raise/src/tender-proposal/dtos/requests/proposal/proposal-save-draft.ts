import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { TenderFilePayload } from '../../../../tender-commons/dto/tender-file-payload.dto';
import { ProposalCreateDto } from './proposal-create.dto';

class BaseSaveDraftDto extends PartialType(ProposalCreateDto) {
  @Exclude()
  @ApiProperty()
  project_attachments?: TenderFilePayload | undefined;

  @Exclude()
  @ApiProperty()
  letter_ofsupport?: TenderFilePayload | undefined;
}

export class ProposalSaveDraftDto extends BaseSaveDraftDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  proposal_id: string;

  @ApiProperty()
  letter_ofsupport?: any;

  @ApiProperty()
  project_attachments?: any;
}

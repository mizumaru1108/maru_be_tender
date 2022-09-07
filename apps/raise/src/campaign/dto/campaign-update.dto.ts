import { PartialType } from '@nestjs/swagger';
import { CampaignCreateDto } from './campaign-create.dto';

export class CampaignUpdateDto extends PartialType(CampaignCreateDto) {}

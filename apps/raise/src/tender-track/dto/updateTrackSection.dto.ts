import { TracSectionkDto } from './track.dto';
import { PartialType } from '@nestjs/swagger';
export class UpdateTrackSection extends PartialType(TracSectionkDto) {}

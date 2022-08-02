import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHrDto } from './create-hr.dto';

/* partial types, means the extended props can be filled or not (optional) */
export class UpdateHrDto extends PartialType(CreateHrDto) {}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { UploadProposalFilesDto } from '../../../tender-commons/dto/upload-proposal-files.dto';

// form1: {
//   project_name: '',
//   project_idea: '',
//   project_location: '',
//   project_implement_date: '',
//   execution_time: '',
//   project_beneficiaries: '',
//   letter_ofsupport_req: { url: '', size: undefined, type: '' },
//   project_attachments: { url: '', size: undefined, type: '' },
// },

export class CreateProposalFirstStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_idea: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_location: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_implement_date: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  execution_time: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  project_beneficiaries: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => UploadProposalFilesDto)
  @ValidateNested()
  letter_ofsupport_req: UploadProposalFilesDto;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => UploadProposalFilesDto)
  @ValidateNested()
  project_attachments: UploadProposalFilesDto;
}

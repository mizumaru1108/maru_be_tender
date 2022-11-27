import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ProposalAction } from '../enum/proposalAction.enum';
import { ConsultantForm } from './consultantForm.dto';
import { SupervisorForm } from './supervisorForm.dto';

export class UpdateProposalByCmsUsers {

  @ApiProperty({enum: ProposalAction})
  action: ProposalAction;

  @ApiProperty({type: String})
  notes: string;

  @ApiProperty({type: String})
  @IsOptional()
  track_id: string;

  @ApiProperty({type: String})
  @IsOptional()
  supervisor_id: string;

  @ApiProperty({type: SupervisorForm})
  @IsOptional()
  superVisorForm: SupervisorForm;

  @ApiProperty({type: ConsultantForm})
  @IsOptional()
  consultantForm: ConsultantForm

}

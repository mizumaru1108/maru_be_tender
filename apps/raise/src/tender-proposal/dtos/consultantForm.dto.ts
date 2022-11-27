import { ApiProperty } from '@nestjs/swagger';

export class ConsultantForm {

  @ApiProperty({type: String})
  chairman_of_board_of_directors: string;

  @ApiProperty({type: Boolean})
  been_supported_before: boolean;

  @ApiProperty({type: String})
  most_clents_projects: string;

  @ApiProperty({type: String})
  added_value: string;

  @ApiProperty({type: String})
  reasons_to_accept: string;

  @ApiProperty({type: Number})
  target_group_num: number;

  @ApiProperty({type: String})
  target_group_type: string;

  @ApiProperty({type: Number})
  target_group_age: number;

  @ApiProperty({type: Boolean})
  been_made_before: boolean;

  @ApiProperty({type: Boolean})
  remote_or_insite: boolean;

  @ApiProperty({type: Array})
  recommended_support_consultant: Array<{ clause: string; explanation: string; amount: number }>;

  @ApiProperty({type: String})
  clause: string;
};
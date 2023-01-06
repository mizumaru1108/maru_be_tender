import { ApiProperty } from '@nestjs/swagger';

export class GetRawBeneficiariesDataResponseDto {
  @ApiProperty()
  project_track: string | null;
  @ApiProperty()
  num_ofproject_binicficiaries: number | null;
  @ApiProperty()
  project_beneficiaries: string | null;
}

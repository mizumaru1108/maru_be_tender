import { ApiProperty } from '@nestjs/swagger';

export class IGetBeneficiariesByTrackDto {
  @ApiProperty()
  track: string;

  @ApiProperty()
  total_project_beneficiaries: number;
}

export class IGetBeneficiariesByTypeDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  total_project_beneficiaries: number;
}

export class GetBeneficiariesReportDto {
  @ApiProperty()
  by_track: IGetBeneficiariesByTrackDto[] | [];

  @ApiProperty()
  by_type: IGetBeneficiariesByTypeDto[] | [];
}

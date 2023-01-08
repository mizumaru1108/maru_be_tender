import { ApiProperty } from '@nestjs/swagger';

export class GetPartnersStatisticByStatusResponseDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  data_count: number;
}

export class GetPartnersStatisticByRegionResponseDto {
  @ApiProperty()
  label: string;

  @ApiProperty({
    type: GetPartnersStatisticByStatusResponseDto,
    isArray: true,
  })
  data_count: GetPartnersStatisticByStatusResponseDto[];

  @ApiProperty()
  total: number;
}

export class GetPartnersStatisticByGovernorateResponseDto {
  @ApiProperty()
  label: string;

  @ApiProperty({
    type: GetPartnersStatisticByStatusResponseDto,
    isArray: true,
  })
  data_count: GetPartnersStatisticByStatusResponseDto[];

  @ApiProperty()
  total: number;
}

export class GetPartnersStatisticMonthlyDataResponseDto {
  @ApiProperty({
    type: GetPartnersStatisticByStatusResponseDto,
    isArray: true,
  })
  this_month: GetPartnersStatisticByStatusResponseDto[];

  @ApiProperty({
    type: GetPartnersStatisticByStatusResponseDto,
    isArray: true,
  })
  last_month: GetPartnersStatisticByStatusResponseDto[];
}

export class GetPartnersStatisticResponseDto {
  @ApiProperty({
    type: GetPartnersStatisticByStatusResponseDto,
    isArray: true,
  })
  by_status: GetPartnersStatisticByStatusResponseDto[];

  @ApiProperty({
    type: GetPartnersStatisticByRegionResponseDto,
    isArray: true,
  })
  by_region: GetPartnersStatisticByRegionResponseDto[];

  @ApiProperty({
    type: GetPartnersStatisticByGovernorateResponseDto,
    isArray: true,
  })
  by_governorate: GetPartnersStatisticByGovernorateResponseDto[];

  @ApiProperty({
    type: GetPartnersStatisticMonthlyDataResponseDto,
  })
  monthlyData: GetPartnersStatisticMonthlyDataResponseDto;
}

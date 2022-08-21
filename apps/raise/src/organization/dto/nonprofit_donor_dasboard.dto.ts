import { IsEnum } from 'class-validator';
import { FilterQueryDonorDashboard } from '../enums';

export class FilterDonorDashboardDto {
  organizationId: string;
  campaignId: string;
  donorUserId: string;
  currency: string;
  nonprofitRealmId: string;

  @IsEnum(FilterQueryDonorDashboard)
  priode?: FilterQueryDonorDashboard;
}

export class PaymentRequestDto {
  organizationId: string;
  donorId: string;
  campaignId: string;
  // donorUserId: string;
  // donorRealmId: string;
  // nonprofitRealmId: string;
  type: string;
  amount: number;
  currency: string;
}

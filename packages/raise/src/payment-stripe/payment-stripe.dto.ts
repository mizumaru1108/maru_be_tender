export class PaymentRequestDto {
  nonprofitUserId: string;
  campaignId: string;
  donorUserId: string;
  donorRealmId: string;
  nonprofitRealmId: string;
  type: string;
  amount: string;
  paymentMethodType: string;
}

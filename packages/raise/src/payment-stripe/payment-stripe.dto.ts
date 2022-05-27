export class PaymentRequestDto {
  organizationId: string;
  campaignId: string;
  donorId: string;
  type: string;
  amount: string;
  paymentMethodType: string;
  currency: string;
  success_url: string;
  cancel_url: string;
  price: string;
  quantity: string;
}

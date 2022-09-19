import { IPaymentGatewayItems } from '../../commons/interfaces/payment-gateway-items.interface';
import { DonationDetail } from '../../donation/schema/donation-detail.schema';

export interface DonorDonationTypeMapResult {
  items: IPaymentGatewayItems;
  subAmount: number;
  donationDetails: DonationDetail;
}

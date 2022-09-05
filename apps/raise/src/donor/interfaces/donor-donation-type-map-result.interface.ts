import { IPaymentGatewayItems } from '../../commons/interfaces/payment-gateway-items.interface';
import { DonationDetail } from '../schema/donation-detail.schema';

export interface DonorDonationTypeMapResult {
  items: IPaymentGatewayItems;
  subAmount: number;
  donationDetails: DonationDetail;
}

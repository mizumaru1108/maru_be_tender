import { IPaymentGatewayItems } from './payment-gateway-items.interface';

/**
 * common interface for payment gateway items (item has to be paid)
 */
export interface IPaymentGatewayItemPayloads {
  items: IPaymentGatewayItems[];
  totalAmount: number;
}

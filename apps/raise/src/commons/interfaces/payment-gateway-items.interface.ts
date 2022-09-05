/**
 * common interface for payment gateway items (item has to be paid)
 */
export interface IPaymentGatewayItems {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  total?: number;
  currency?: string;
}

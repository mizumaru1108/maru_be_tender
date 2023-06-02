import { Types } from 'mongoose';
import moment from 'moment';

export function CreateNewPaymentGateway(
  organization_id: string,
  payment_name: string,
  currency: string,
) {
  const paymentGatewayData = {
    _id: new Types.ObjectId(),
    organizationId: new Types.ObjectId(organization_id),
    name: payment_name,
    defaultCurrency: currency,
    profileId: '',
    profileName: '',
    apiKey: '',
    clientKey: '',
    serverKey: '',
    paymentMethod: '',
    isActive: 'N',
    isDeleted: 'N',
    isLiveMode: 'N',
    isTestMode: 'N',
    createdAt: moment().toISOString(),
    updatedAt: moment().toISOString(),
  };

  return paymentGatewayData;
}

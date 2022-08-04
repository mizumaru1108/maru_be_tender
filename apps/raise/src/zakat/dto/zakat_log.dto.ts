import { Types } from 'mongoose';

class ZakatLogDetails {
  readonly name: string;
  readonly unit: string;
  readonly carat: number;
  readonly number_of_units: number;
  readonly amount: number;
  readonly currency: string;
}

export class ZakatLogDto {
  readonly id: Types.ObjectId;
  readonly donationLogId: Types.ObjectId;
  readonly type: string;
  readonly currency: string;
  readonly total_amount: number;
  readonly unit: string;
  readonly number_of_units: number;
  readonly details: Array<ZakatLogDetails>;
  readonly createdAt: Date;
}

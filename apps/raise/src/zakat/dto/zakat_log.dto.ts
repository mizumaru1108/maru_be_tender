import { Types } from 'mongoose';

class ZakatLogDetails {
  readonly name: string;
  readonly unit: string;
  readonly carat: number;
  readonly numberOfUnits: number;
  readonly amount: number;
  readonly currency: string;
}

export class ZakatLogDto {
  readonly id: Types.ObjectId;
  readonly donationLogId: Types.ObjectId;
  readonly type: string;
  readonly currency: string;
  readonly totalAmount: number;
  readonly unit: string;
  readonly numberOfUnits: number;
  readonly details: Array<ZakatLogDetails>;
  readonly createdAt: Date;
}

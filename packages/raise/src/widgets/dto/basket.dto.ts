import { Types } from 'mongoose';

export class BasketDto {
  readonly id: string;
  readonly campaignId: Types.ObjectId;
  readonly donorId: Types.ObjectId;
  readonly donationType: string;
  readonly currency: string;
  readonly amount: number;
  readonly unit: number;
  readonly isDeleted: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

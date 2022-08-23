import { IsArray } from "class-validator";
import { Types } from "mongoose";

export class PaymentRequestCartDto {
  organizationId: Types.ObjectId;
  donorId: Types.ObjectId;
  type: string;
  currency: string;
  success_url: string;
  cancel_url: string;
  extraAmount: number;
  @IsArray()
  data_basket: string[];
}
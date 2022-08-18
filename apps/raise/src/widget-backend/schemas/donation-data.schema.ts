import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DonationDocument = Donation & Document;

@Schema({ collection: 'donation' })
export class Donation {
  @Prop()
  id: string;

  @Prop()
  donorEmail: string;

  @Prop()
  donorName?: string;

  @Prop()
  donorPhone?: string;

  @Prop()
  receiverName?: string;

  @Prop()
  receiverPhone?: string;

  @Prop()
  country: string;

  @Prop()
  donationAmount: string;

  @Prop()
  currency: string;

  @Prop()
  description?: string;

  @Prop()
  donationPurpose?: string;

  @Prop()
  donationCategory?: string;

  @Prop()
  regularity: "Once" | "Daily" | "Weekly" | "Monthly";

  @Prop()
  donationForm: "Quick" | "Unit" | "Money" | "Gift" | "Dynamic";

  @Prop()
  donationType: "Just" | "Gift";

  @Prop()
  paymentMethod: "stripe" | "paypal" | "payoneer" | "paytabs";

  @Prop()
  receipt_link: string;

  @Prop()
  paymentStatus: "succeeded" | "failed"


}

export const DonationSchema = SchemaFactory.createForClass(Donation);
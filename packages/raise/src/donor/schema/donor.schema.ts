import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DonorDocument = Donor & Document;

@Schema({ collection: 'donor' })
export class Donor {
  @Prop()
  _id: string;

  @Prop()
  donorId: string;

  @Prop()
  email: string;

  @Prop({ item: String, type: () => Array })
  public favoriteCampaignIds?: string[];
}

export const DonorSchema = SchemaFactory.createForClass(Donor);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DonorDocument = Donor & Document;

@Schema({ collection: 'donor' })
export class Donor {
  @Prop()
  donorId: string;

  @Prop({ item: String, type: () => Array })
  public favoriteCampaignIds?: string[];
}

export const DonorSchema = SchemaFactory.createForClass(Donor);

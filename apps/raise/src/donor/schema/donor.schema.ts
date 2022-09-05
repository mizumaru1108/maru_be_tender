import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type DonorDocument = Donor & Document;

@Schema({ collection: 'donor' })
export class Donor {

  @Prop()
  organizationId: string;

  @Prop()
  isAnonymous: boolean;

  @Prop()
  id: string;

  @Prop()
  ownerUserId: string;

  @Prop()
  donorId: string;

  @Prop()
  email: string;

  @Prop()
  about: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipcode: string;

  @Prop()
  address: string;

  @Prop()
  country: string;

  @Prop()
  facebook: string;

  @Prop()
  twitter: string;

  @Prop()
  linkedin: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  gender: string;

  @Prop()
  mobile: string;

  @Prop({ item: String, type: () => Array })
  public favoriteCampaignIds?: string[];

  @Prop()
  profilePic: string;
}

export const DonorSchema = SchemaFactory.createForClass(Donor)
  .plugin(paginate)
  .plugin(aggregatePaginate);

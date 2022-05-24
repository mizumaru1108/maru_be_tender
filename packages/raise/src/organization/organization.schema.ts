import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ collection: 'organization' })
export class Organization {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  username: string;
  @Prop()
  contactEmail: string;
  @Prop()
  contactPhone: string;
  @Prop()
  defaultCurrency: string;
  @Prop()
  country: string;
  @Prop()
  state: string;
  @Prop()
  city: string;
  @Prop()
  address: string;
  @Prop()
  zipCode: string;
  @Prop()
  aboutHeading: string;
  @Prop()
  aboutBody: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

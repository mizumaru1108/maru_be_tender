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
  defaultCurrency: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

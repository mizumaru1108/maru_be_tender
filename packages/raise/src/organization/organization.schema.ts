import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ collection: 'organization' })
export class Organization {
  @Prop()
  name: string;
  @Prop()
  username: string;
  @Prop()
  contactEmail: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

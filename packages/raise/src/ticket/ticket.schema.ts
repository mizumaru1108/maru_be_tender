import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

@Schema({ collection: 'ticket' })
export class Ticket {
  @Prop()
  ticketId: string;

  @Prop()
  title: string;

  @Prop()
  department: string;

  @Prop()
  userCreatorType: string;

  @Prop()
  userCreatorId: string;

  @Prop()
  description: string;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  userOwnerId: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

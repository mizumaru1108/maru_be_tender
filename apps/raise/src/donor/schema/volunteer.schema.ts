import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VolunteerDocument = Volunteer & Document;

@Schema({ collection: 'volunteer' })
export class Volunteer {
  @Prop({ type: Types.ObjectId })
  public _id?: Types.ObjectId;

  @Prop({type: Types.ObjectId})
  public donorId: Types.ObjectId;

  @Prop({location: String})
  public location: string;

  @Prop({channel: String})
  public channel: string;

  @Prop({abilities: String})
  public abilities: string;

  @Prop({freeTime: String})
  public freeTime: string;

  @Prop({document: String})
  public document: string;

  @Prop({createdAt: String})
  public createdAt: string;

  @Prop({updatedAt: String})
  public updatedAt: string;

  @Prop({isDeleted: String})
  public isDeleted: string;

  @Prop({isActive: String})
  public isActive: string;
 
}

export const VolunteerSchema = SchemaFactory.createForClass(Volunteer);

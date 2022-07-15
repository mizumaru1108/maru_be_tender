import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectsDocument = Projects & Document;

@Schema({ collection: 'project' })
export class Projects {
  @Prop({ type: () => String })
  public _id?: string;

  @Prop({ type: () => String, ref: 'projectOperatorMap' })
  public operatorId?: string;

  @Prop({ type: () => String })
  public name?: string;

  @Prop({ type: () => String })
  public createdAt?: String;
}

export const ProjectsSchema =
  SchemaFactory.createForClass(Projects);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class CostEntry extends Document {
  @Prop()
  category: string;

  @Prop()
  amount: number;

  @Prop()
  date: Date;

  @Prop()
  description: string;
}

export const CostEntrySchema = SchemaFactory.createForClass(CostEntry); 
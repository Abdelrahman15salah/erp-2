import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class InvoiceItem {
  @Prop()
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  unitPrice: number;
}

@Schema()
export class Invoice extends Document {
  @Prop()
  invoiceNumber: string;

  @Prop()
  clientId: string;

  @Prop([InvoiceItem])
  items: InvoiceItem[];

  @Prop()
  tax: number;

  @Prop()
  discount: number;

  @Prop()
  dueDate: Date;

  @Prop()
  status: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice); 
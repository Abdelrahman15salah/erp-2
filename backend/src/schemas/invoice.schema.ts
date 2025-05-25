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

  @Prop()
  subtotal: number;
}

@Schema()
export class ClientContact {
  @Prop()
  email: string;

  @Prop()
  phone: string;
}

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop()
  invoiceNumber: string;

  @Prop()
  clientId: string;

  @Prop()
  clientName: string;

  @Prop()
  clientContact: ClientContact;

  @Prop([InvoiceItem])
  items: InvoiceItem[];

  @Prop()
  subtotal: number;

  @Prop()
  tax: number;

  @Prop()
  taxRate: number;

  @Prop()
  taxRegion: string;

  @Prop()
  discount: number;

  @Prop()
  total: number;

  @Prop()
  dueDate: Date;

  @Prop()
  status: string;

  @Prop()
  createdAt: Date;

  @Prop()
  lastReminderSent: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

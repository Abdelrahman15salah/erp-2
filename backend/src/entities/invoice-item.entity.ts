import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Invoice, invoice => invoice.items)
  invoice: Invoice;
} 
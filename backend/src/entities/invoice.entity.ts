import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';
import { ClientContact } from './client-contact.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: string;

  @Column()
  clientName: string;

  @Column(() => ClientContact)
  clientContact: ClientContact;

  @OneToMany(() => InvoiceItem, item => item.invoice, { cascade: true })
  items: InvoiceItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  taxRate: number;

  @Column()
  taxRegion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  discount: number;

  @Column()
  dueDate: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  lastReminderSent: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 
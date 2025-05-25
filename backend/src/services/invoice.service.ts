import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../schemas/invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const count = await this.invoiceModel.countDocuments();
    return `INV-${year}-${month}-${String(count + 1).padStart(4, '0')}`;
  }

  private calculateSubtotal(items: any[]): number {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  calculateTax(subtotal: number, taxRate: number, region: string): number {
    // Basic tax calculation - can be enhanced with region-specific rules
    return subtotal * (taxRate / 100);
  }

  private calculateTotal(subtotal: number, tax: number, discount: number): number {
    return subtotal + tax - discount;
  }

  async create(invoiceData: any): Promise<Invoice> {
    const invoiceNumber = await this.generateInvoiceNumber();
    
    // Calculate totals
    const subtotal = this.calculateSubtotal(invoiceData.items);
    const tax = this.calculateTax(subtotal, invoiceData.taxRate, invoiceData.taxRegion);
    const total = this.calculateTotal(subtotal, tax, invoiceData.discount || 0);

    const newInvoice = new this.invoiceModel({
      ...invoiceData,
      invoiceNumber,
      subtotal,
      tax,
      total,
      status: 'pending',
      createdAt: new Date()
    });

    return newInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(id: string, updateData: any): Promise<Invoice> {
    const invoice = await this.findOne(id);
    
    // Recalculate totals if items are updated
    if (updateData.items) {
      const subtotal = this.calculateSubtotal(updateData.items);
      const tax = this.calculateTax(subtotal, updateData.taxRate || invoice.taxRate, updateData.taxRegion || invoice.taxRegion);
      const total = this.calculateTotal(subtotal, tax, updateData.discount || invoice.discount);
      
      updateData.subtotal = subtotal;
      updateData.tax = tax;
      updateData.total = total;
    }

    const updatedInvoice = await this.invoiceModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return updatedInvoice;
  }

  async getDueReminders(): Promise<Invoice[]> {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    return this.invoiceModel.find({
      dueDate: { $gte: today, $lte: nextWeek },
      status: { $ne: 'paid' }
    }).exec();
  }

  async sendReminder(invoiceId: string): Promise<{ success: boolean; message: string }> {
    const invoice = await this.findOne(invoiceId);
    
    // Basic reminder implementation
    const reminder = {
      to: invoice.clientContact.email,
      subject: `Invoice Reminder: ${invoice.invoiceNumber}`,
      message: `This is a reminder that invoice ${invoice.invoiceNumber} for ${invoice.total} is due on ${invoice.dueDate}`
    };

    // Update last reminder sent
    await this.invoiceModel.findByIdAndUpdate(invoiceId, {
      lastReminderSent: new Date()
    });

    return {
      success: true,
      message: `Reminder sent to ${reminder.to} for invoice ${invoice.invoiceNumber}`
    };
  }
} 
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
    
    // Get the count of invoices for the current month
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const count = await this.invoiceModel.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });
    
    // Format: INV-YYYY-MM-XXXX where XXXX is a sequential number
    return `INV-${year}-${month}-${String(count + 1).padStart(4, '0')}`;
  }

  async create(invoice: Invoice): Promise<Invoice> {
    const invoiceNumber = await this.generateInvoiceNumber();
    const newInvoice = new this.invoiceModel({
      ...invoice,
      invoiceNumber,
      status: 'pending'
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

  async update(id: string, invoice: Invoice): Promise<Invoice> {
    const updatedInvoice = await this.invoiceModel
      .findByIdAndUpdate(id, invoice, { new: true })
      .exec();
    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return updatedInvoice;
  }

  async calculateTax(subtotal: number, taxRate: number): Promise<number> {
    return subtotal * (taxRate / 100);
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
    return {
      success: true,
      message: `Reminder sent for invoice ${invoice.invoiceNumber} to client ${invoice.clientId}`
    };
  }
} 
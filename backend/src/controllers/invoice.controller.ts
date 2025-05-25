import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../schemas/invoice.schema';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() invoice: Invoice) {
    return this.invoiceService.create(invoice);
  }

  @Get()
  async findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() invoice: Invoice) {
    return this.invoiceService.update(id, invoice);
  }

  @Post('calculate-tax')
  async calculateTax(@Body() data: { subtotal: number; taxRate: number; region: string }) {
    return this.invoiceService.calculateTax(data.subtotal, data.taxRate, data.region);
  }

  @Get('reminders/due')
  async getDueReminders() {
    return this.invoiceService.getDueReminders();
  }

  @Post('reminders/:id/send')
  async sendReminder(@Param('id') id: string) {
    return this.invoiceService.sendReminder(id);
  }
} 
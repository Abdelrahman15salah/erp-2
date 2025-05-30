import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InvoiceService } from '../services/invoice.service';
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }

  @Get('reminders/due')
  getDueInvoices() {
    return this.invoiceService.getDueInvoices();
  }

  @Post(':id/reminder')
  sendReminder(@Param('id') id: string) {
    return this.invoiceService.sendReminder(id);
  }

  @Get('tax/calculate')
  calculateTax(
    @Query('amount') amount: number,
    @Query('taxRate') taxRate: number,
    @Query('region') region: string
  ) {
    return this.invoiceService.calculateTax(amount, taxRate, region);
  }
} 
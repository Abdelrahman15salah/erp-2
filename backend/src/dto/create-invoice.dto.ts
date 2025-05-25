import { IsString, IsNumber, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceItemDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}

class ClientContactDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;
}

export class CreateInvoiceDto {
  @IsString()
  clientId: string;

  @IsString()
  clientName: string;

  @ValidateNested()
  @Type(() => ClientContactDto)
  clientContact: ClientContactDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsNumber()
  taxRate: number;

  @IsString()
  taxRegion: string;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsString()
  dueDate: string;
} 
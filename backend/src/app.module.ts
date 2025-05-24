import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CostEntryController } from './controllers/cost-entry.controller';
import { InvoiceController } from './controllers/invoice.controller';
import { CostEntryService } from './services/cost-entry.service';
import { InvoiceService } from './services/invoice.service';
import { CostEntry, CostEntrySchema } from './schemas/cost-entry.schema';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, databaseConfig.options),
    MongooseModule.forFeature([
      { name: CostEntry.name, schema: CostEntrySchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
  ],
  controllers: [AppController, CostEntryController, InvoiceController],
  providers: [AppService, CostEntryService, InvoiceService],
})
export class AppModule {}

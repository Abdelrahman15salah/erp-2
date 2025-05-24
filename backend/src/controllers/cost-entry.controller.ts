import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CostEntryService } from '../services/cost-entry.service';
import { CostEntry } from '../schemas/cost-entry.schema';

@Controller('cost-entries')
export class CostEntryController {
  constructor(private readonly costEntryService: CostEntryService) {}

  @Post()
  async create(@Body() costEntry: CostEntry) {
    return this.costEntryService.create(costEntry);
  }

  @Get()
  async findAll() {
    return this.costEntryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.costEntryService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() costEntry: CostEntry) {
    return this.costEntryService.update(id, costEntry);
  }
} 
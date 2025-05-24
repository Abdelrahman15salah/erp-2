import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CostEntry } from '../schemas/cost-entry.schema';

@Injectable()
export class CostEntryService {
  constructor(
    @InjectModel(CostEntry.name) private costEntryModel: Model<CostEntry>,
  ) {}

  async create(costEntry: CostEntry): Promise<CostEntry> {
    const newCostEntry = new this.costEntryModel(costEntry);
    return newCostEntry.save();
  }

  async findAll(): Promise<CostEntry[]> {
    return this.costEntryModel.find().exec();
  }

  async findOne(id: string): Promise<CostEntry> {
    const costEntry = await this.costEntryModel.findById(id).exec();
    if (!costEntry) {
      throw new NotFoundException(`Cost entry with ID ${id} not found`);
    }
    return costEntry;
  }

  async update(id: string, costEntry: CostEntry): Promise<CostEntry> {
    const updatedCostEntry = await this.costEntryModel
      .findByIdAndUpdate(id, costEntry, { new: true })
      .exec();
    if (!updatedCostEntry) {
      throw new NotFoundException(`Cost entry with ID ${id} not found`);
    }
    return updatedCostEntry;
  }
} 
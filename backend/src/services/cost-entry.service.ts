import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CostEntry } from '../schemas/cost-entry.schema';

@Injectable()
export class CostEntryService {
  constructor(
    @InjectModel(CostEntry.name) private costEntryModel: Model<CostEntry>,
  ) {}

  async create(costEntryData: {
    category: string;
    amount: number;
    date: Date;
    description: string;
  }): Promise<CostEntry> {
    const newCostEntry = new this.costEntryModel({
      ...costEntryData,
      date: costEntryData.date || new Date()
    });
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

  async update(id: string, costEntryData: Partial<CostEntry>): Promise<CostEntry> {
    const updatedCostEntry = await this.costEntryModel
      .findByIdAndUpdate(id, costEntryData, { new: true })
      .exec();
    if (!updatedCostEntry) {
      throw new NotFoundException(`Cost entry with ID ${id} not found`);
    }
    return updatedCostEntry;
  }

  async findByCategory(category: string): Promise<CostEntry[]> {
    return this.costEntryModel.find({ category }).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<CostEntry[]> {
    return this.costEntryModel.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).exec();
  }
} 
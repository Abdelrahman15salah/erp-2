import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = {
  uri: process.env.MONGODB_URI || 'mongodb+srv://bedo:bedo@bedo.3o3y4ub.mongodb.net/cost-management',
  options: {
    autoIndex: true,
    autoCreate: true,
  } as MongooseModuleOptions,
}; 
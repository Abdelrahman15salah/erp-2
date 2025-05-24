import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = {
  uri: process.env.MONGODB_URI,
  options: {
    autoIndex: true,
    autoCreate: true,
  } as MongooseModuleOptions,
}; 
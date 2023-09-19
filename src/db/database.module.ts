// database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import config from './database.config';

dotenv.config();

@Module({
  imports: [TypeOrmModule.forRoot(config)], // Передайте конфигурацию в TypeOrmModule.forRoot()
})
export class DatabaseModule {}

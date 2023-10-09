import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './database.config';

dotenv.config();

@Module({
  imports: [TypeOrmModule.forRoot(config)],
})
export class DatabaseModule {}

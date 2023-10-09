import * as dotenv from 'dotenv';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Post } from '../entities/post.entity';
import { Vote } from '../entities/vote.entity';

dotenv.config();

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Vote])],
  controllers: [UserController, AuthController],
  providers: [UserService, Logger],
})
export class UserModule {}

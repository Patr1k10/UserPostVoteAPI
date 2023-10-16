import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { User } from '../entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Post } from '../entities/post.entity';
import { Vote } from '../entities/vote.entity';
import { AuthModule } from '../guard/auth.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Vote]),
    AuthModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

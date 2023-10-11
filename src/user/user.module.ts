import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
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
  controllers: [UserController, AuthController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

import { User } from '../entities/user.entity';
import { Vote } from '../entities/vote.entity';
import { Post } from '../entities/post.entity';
import { JwtStrategy } from '../guard/jwt.strategy';
import { AuthModule } from '../guard/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, User, Post]), AuthModule],
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}

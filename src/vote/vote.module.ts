import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { User } from '../entities/users.entity';
import { Vote } from '../entities/vote.entity';
import { Post } from '../entities/post.entity';
import { AuthModule } from '../guard/auth.module';
import { VoteResolver } from './vote.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, User, Post]), AuthModule],
  providers: [VoteService, VoteResolver],
  controllers: [VoteController],
})
export class VoteModule {}

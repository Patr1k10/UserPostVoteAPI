import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

import { User } from '../entities/user.entity';
import { Vote } from '../entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, User])],
  providers: [VoteService],
  controllers: [VoteController],
})
export class VoteModule {}

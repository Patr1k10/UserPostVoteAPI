import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { ProcessVoteDTO } from './dto/vote.dto';

import { User } from '../entities/user.entity';
import { Vote } from '../entities/vote.entity';

@ApiTags('votes')
@Injectable()
export class VoteService {
  constructor(
    private readonly logger: PinoLogger,

    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    logger.setContext(VoteService.name);
  }

  private async checkLastVoted(existingVote: Vote): Promise<boolean> {
    this.logger.info('Checking last voted time.');
    if (existingVote) {
      const dateNow = new Date();
      const lastVoteDate = new Date(existingVote.updatedAt);
      if (Math.abs(dateNow.getTime() - lastVoteDate.getTime()) < 3600000) {
        this.logger.warn('Vote rejected due to time constraint.');
        throw new BadRequestException('You need to wait one hour from your last vote to proceed.');
      }
    }
    this.logger.info('Vote time check passed.');
    return true;
  }

  @ApiOperation({ summary: 'Process a new vote' }) // Декоратор для описания операции в Swagger UI
  @ApiResponse({ status: 201, description: 'The vote has been successfully processed.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async processVote(voteDto: ProcessVoteDTO): Promise<void> {
    this.logger.info('Processing a new vote.');
    const { fromUsername, toUsername, value } = voteDto;
    const existingVote = await this.voteRepository.findOne({ where: { fromUsername, toUsername } });
    await this.checkLastVoted(existingVote);
    if (existingVote) {
      this.logger.warn('User already voted.');
      throw new BadRequestException('User already voted');
    }
    const user = await this.userRepository.findOne({ where: { username: toUsername } });
    if (!user) {
      this.logger.warn('User not found.');
      throw new BadRequestException('User not found');
    }
    user.rating += value;
    await this.userRepository.save(user);
    const newVote = this.voteRepository.create({ fromUsername, toUsername, value });
    await this.voteRepository.save(newVote);
    this.logger.info('Successfully processed a new vote.');
  }

  @ApiOperation({ summary: 'Update an existing vote' })
  @ApiResponse({ status: 200, description: 'The vote has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateVote(voteDto: ProcessVoteDTO): Promise<void> {
    this.logger.info('Updating an existing vote.');
    const { fromUsername, toUsername, value } = voteDto;
    const existingVote = await this.voteRepository.findOne({ where: { fromUsername, toUsername } });
    await this.checkLastVoted(existingVote);
    if (!existingVote) {
      this.logger.warn('No existing vote to update.');
      throw new BadRequestException('No existing vote to update');
    }
    const user = await this.userRepository.findOne({ where: { username: toUsername } });
    if (!user) {
      this.logger.warn('User not found.');
      throw new BadRequestException('User not found');
    }
    user.rating = user.rating - existingVote.value + value;
    await this.userRepository.save(user);
    existingVote.value = value;
    await this.voteRepository.save(existingVote);
    this.logger.info('Successfully updated the vote.');
  }

  @ApiOperation({ summary: 'Delete an existing vote' })
  @ApiResponse({ status: 200, description: 'The vote has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async deleteVote(fromUsername: string, toUsername: string): Promise<void> {
    this.logger.info('Deleting an existing vote.');
    const existingVote = await this.voteRepository.findOne({ where: { fromUsername, toUsername } });
    if (!existingVote) {
      this.logger.warn('No existing vote to delete.');
      throw new BadRequestException('No existing vote to delete');
    }
    const user = await this.userRepository.findOne({ where: { username: toUsername } });
    if (!user) {
      this.logger.warn('User not found.');
      throw new BadRequestException('User not found');
    }
    user.rating -= existingVote.value;
    await this.userRepository.save(user);
    await this.voteRepository.softDelete(existingVote);
    this.logger.info('Successfully deleted the vote.');
  }
}

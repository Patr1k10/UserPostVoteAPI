import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { User } from '../user/entities/user.entity';
import { ProcessVoteDTO } from './dto/vote.dto';
import { PinoLogger } from 'nestjs-pino';

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

  private async _checkLastVoted(existingVote: Vote): Promise<boolean> {
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

  async processVote(voteDto: ProcessVoteDTO): Promise<void> {
    this.logger.info('Processing a new vote.');
    const { fromUsername, toUsername, value } = voteDto;
    const existingVote = await this.voteRepository.findOne({ where: { fromUsername, toUsername } });
    await this._checkLastVoted(existingVote);
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

  async updateVote(voteDto: ProcessVoteDTO): Promise<void> {
    this.logger.info('Updating an existing vote.');
    const { fromUsername, toUsername, value } = voteDto;
    const existingVote = await this.voteRepository.findOne({ where: { fromUsername, toUsername } });
    await this._checkLastVoted(existingVote);
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
    await this.voteRepository.remove(existingVote);
    this.logger.info('Successfully deleted the vote.');
  }
}

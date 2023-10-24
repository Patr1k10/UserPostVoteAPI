import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { ProcessVoteDTO } from './dto/vote.dto';
import { User } from '../entities/users.entity';
import { Vote } from '../entities/vote.entity';
import { Post } from '../entities/post.entity';
import { IRatable } from '../interface/rateble.interface';
import { GetUserDto } from '../users/dto/get.user.dto';

@ApiTags('votes')
@Injectable()
export class VoteService {
  constructor(
    private readonly logger: PinoLogger,

    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {
    logger.setContext(VoteService.name);
  }

  private async getRatableEntity(entityType: string, entityId: number): Promise<IRatable> {
    let entity: IRatable = null;

    switch (entityType) {
      case 'User':
        entity = await this.userRepository.findOne({ where: { id: entityId } });
        break;
      case 'Post':
        entity = await this.postRepository.findOne({ where: { id: entityId } });
        break;
      default:
        this.logger.warn(`Unknown entity type: ${entityType}`);
        throw new BadRequestException(`Unknown entity type: ${entityType}`);
    }

    if (!entity) {
      this.logger.warn(`Entity not found. Type: ${entityType}, ID: ${entityId}`);
      throw new BadRequestException(`Entity not found. Type: ${entityType}, ID: ${entityId}`);
    }
    return entity;
  }

  private async checkLastVoted(existingVote: Vote): Promise<boolean> {
    this.logger.info('Checking last voted time.');
    if (existingVote) {
      const dateNow = new Date();
      const lastVoteDate = new Date(existingVote.updated_at);
      if (Math.abs(dateNow.getTime() - lastVoteDate.getTime()) < 3600000) {
        this.logger.warn('Vote rejected due to time constraint.');
        throw new BadRequestException('You need to wait one hour from your last vote to proceed.');
      }
    }
    this.logger.info('Vote time check passed.');
    return true;
  }

  @ApiOperation({ summary: 'Process a new vote' })
  async processVote(voteDto: ProcessVoteDTO, user: GetUserDto): Promise<void> {
    if (user.id === voteDto.fromUserId) {
      throw new BadRequestException("You can't vote for yourself");
    }
    voteDto.fromUserId = user.id;
    this.logger.info('Processing a new vote.');
    const { entityType, entityId, value, fromUserId } = voteDto;
    const existingVote = await this.voteRepository.findOne({ where: { fromUserId, entityType, entityId } });
    await this.checkLastVoted(existingVote);
    if (existingVote) {
      this.logger.warn('User already voted.');
      throw new BadRequestException('User already voted');
    }
    const entity = await this.getRatableEntity(entityType, entityId);
    if (!entity) {
      this.logger.warn('Entity not found.');
      throw new BadRequestException('Entity not found');
    }
    entity.rating += value;
    await this.saveEntity(entityType, entity);
    const newVote = this.voteRepository.create({ fromUserId, entityType, entityId, value });
    await this.voteRepository.save(newVote);
    this.logger.info('Successfully processed a new vote.');
  }

  @ApiOperation({ summary: 'Update an existing vote' })
  async updateVote(voteDto: ProcessVoteDTO, user: GetUserDto): Promise<void> {
    if (user.id === voteDto.fromUserId) {
      throw new BadRequestException("You can't vote for yourself");
    }
    this.logger.info('Updating an existing vote.');
    const { entityType, entityId, value, fromUserId } = voteDto;
    const existingVote = await this.voteRepository.findOne({ where: { fromUserId, entityType, entityId } });
    await this.checkLastVoted(existingVote);
    if (!existingVote) {
      this.logger.warn('No existing vote to update.');
      throw new BadRequestException('No existing vote to update');
    }
    const entity = await this.getRatableEntity(entityType, entityId);
    if (!entity) {
      this.logger.warn('Entity not found.');
      throw new BadRequestException('Entity not found');
    }
    entity.rating = entity.rating - existingVote.value + value;
    await this.saveEntity(entityType, entity);
    existingVote.value = value;
    await this.voteRepository.save(existingVote);
    this.logger.info('Successfully updated the vote.');
  }

  @ApiOperation({ summary: 'Delete an existing vote' })
  async deleteVote(voteDto: ProcessVoteDTO, user: GetUserDto): Promise<void> {
    if (user.id === voteDto.fromUserId) {
      throw new BadRequestException("You can't delete a vote for yourself");
    }
    voteDto.fromUserId = user.id;
    this.logger.info('Deleting an existing vote.');
    const existingVote = await this.voteRepository.findOne({
      where: { fromUserId: voteDto.fromUserId, entityType: voteDto.entityType, entityId: voteDto.entityId },
    });
    if (!existingVote) {
      this.logger.warn('No existing vote to delete.');
      throw new BadRequestException('No existing vote to delete');
    }
    const entity = await this.getRatableEntity(voteDto.entityType, voteDto.entityId);
    if (!entity) {
      this.logger.warn('Entity not found.');
      throw new BadRequestException('Entity not found');
    }
    entity.rating -= existingVote.value;
    await this.saveEntity(voteDto.entityType, entity);
    await this.voteRepository.softDelete(existingVote);
    this.logger.info('Successfully deleted the vote.');
  }

  private async saveEntity(entityType: string, entity: IRatable): Promise<void> {
    if (entityType === 'Post') {
      await this.postRepository.save(entity);
    } else if (entityType === 'User') {
      await this.userRepository.save(entity);
    }
  }
}

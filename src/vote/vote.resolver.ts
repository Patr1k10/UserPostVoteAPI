import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { VoteService } from './vote.service';
import { ProcessVoteDTO } from './dto/vote.dto';
import { GetUserDto } from '../users/dto/get.user.dto';

@Resolver()
export class VoteResolver {
  constructor(private readonly voteService: VoteService) {}

  @Mutation(() => Boolean)
  async createVote(@Args('voteDto') voteDto: ProcessVoteDTO, @Args('user') user: GetUserDto): Promise<boolean> {
    await this.voteService.processVote(voteDto, user);
    return true;
  }

  @Mutation(() => Boolean)
  async updateVote(@Args('voteDto') voteDto: ProcessVoteDTO, @Args('user') user: GetUserDto): Promise<boolean> {
    await this.voteService.updateVote(voteDto, user);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteVote(@Args('voteDto') voteDto: ProcessVoteDTO, @Args('user') user: GetUserDto): Promise<boolean> {
    await this.voteService.deleteVote(voteDto, user);
    return true;
  }
}

import { Controller, Post, Put, Delete, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { VoteService } from './vote.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorator/getUser.decorator';
import { GetUserDto } from '../user/dto/get-user.dto';
import { ProcessVoteDTO } from './dto/vote.dto';

@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createVote(@GetUser() user: GetUserDto, @Body() voteDto: ProcessVoteDTO) {
    if (user.username === voteDto.toUsername) {
      throw new BadRequestException("You can't vote for yourself");
    }
    voteDto.fromUsername = user.username;
    await this.voteService.processVote(voteDto);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateVote(@GetUser() user: GetUserDto, @Body() voteDto: ProcessVoteDTO) {
    if (user.username === voteDto.toUsername) {
      throw new BadRequestException("You can't vote for yourself");
    }
    voteDto.fromUsername = user.username;
    await this.voteService.updateVote(voteDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteVote(@GetUser() user: GetUserDto, @Body() voteDto: ProcessVoteDTO) {
    if (user.username === voteDto.toUsername) {
      throw new BadRequestException("You can't delete a vote for yourself");
    }
    voteDto.fromUsername = user.username;
    await this.voteService.deleteVote(voteDto.fromUsername, voteDto.toUsername);
  }
}

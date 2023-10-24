import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from '../decorator/getUser.decorator';
import { VoteService } from './vote.service';
import { ProcessVoteDTO } from './dto/vote.dto';
import { GetUserDto } from '../users/dto/get.user.dto';

@ApiTags('votes')
@ApiBearerAuth()
@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiOperation({ summary: 'Create a new vote' })
  @ApiBearerAuth()
  @ApiBody({ type: ProcessVoteDTO })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createVote(@GetUser() user: GetUserDto, @Body() voteDto: ProcessVoteDTO) {
    await this.voteService.processVote(voteDto, user);
  }

  @ApiOperation({ summary: 'Update an existing vote' })
  @ApiBody({ type: ProcessVoteDTO })
  @ApiBearerAuth()
  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateVote(@GetUser() user: GetUserDto, @Body() voteDto: ProcessVoteDTO) {
    await this.voteService.updateVote(voteDto, user);
  }

  @ApiOperation({ summary: 'Delete an existing vote' })
  @ApiBearerAuth()
  @ApiBody({ type: ProcessVoteDTO })
  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteVote(@GetUser() user: GetUserDto, @Body() voteDto: ProcessVoteDTO) {
    await this.voteService.deleteVote(voteDto, user);
  }
}

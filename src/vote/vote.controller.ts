import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BadRequestException, Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from '../decorator/getUser.decorator';
import { VoteService } from './vote.service';
import { ProcessVoteDTO } from './dto/vote.dto';
import { GetUserDto } from '../user/dto/get.user.dto';

@ApiTags('votes') // Декоратор для группировки всех методов в Swagger UI
@ApiBearerAuth() // Декоратор для указания того, что для доступа к эндпоинтам нужен Bearer Token
@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiOperation({ summary: 'Create a new vote' }) // Декоратор для описания операции в Swagger UI
  @ApiResponse({ status: 201, description: 'The vote has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createVote(@GetUser() user: GetUserDto, @Body() voteDto: ProcessVoteDTO) {
    if (user.username === voteDto.toUsername) {
      throw new BadRequestException("You can't vote for yourself");
    }
    voteDto.fromUsername = user.username;
    await this.voteService.processVote(voteDto);
  }

  @ApiOperation({ summary: 'Update an existing vote' })
  @ApiResponse({ status: 200, description: 'The vote has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth()
  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateVote(@GetUser() user: GetUserDto, @Body() voteDto: ProcessVoteDTO) {
    if (user.username === voteDto.toUsername) {
      throw new BadRequestException("You can't vote for yourself");
    }
    voteDto.fromUsername = user.username;
    await this.voteService.updateVote(voteDto);
  }

  @ApiOperation({ summary: 'Delete an existing vote' })
  @ApiResponse({ status: 200, description: 'The vote has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth()
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

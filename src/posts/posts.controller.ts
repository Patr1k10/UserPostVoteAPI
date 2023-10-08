import { Controller, Post, Get, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../decorator/getUser.decorator';
import { GetUserDto } from '../user/dto/get.user.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly postsService: PostsService,
  ) {
    logger.setContext(PostsController.name);
  }

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@GetUser() user: GetUserDto, @Body() createPostDto: CreatePostDto) {
    if (!user) {
      this.logger.error('User is undefined');
      throw new BadRequestException('Invalid user');
    }
    if (!user.username) {
      this.logger.error(`Invalid username: ${user.username}`);
      throw new BadRequestException('Invalid username');
    }
    createPostDto.username = user.username;
    this.logger.info(`Username from JWT: ${user.username}`);

    return this.postsService.create(createPostDto);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   return this.postsService.findOne(id);
  // }

  //   @Put(':id')
  //   async update(@Param('id') id: number, @Body() updatePostDto: { title: string; content: string }) {
  //     const { title, content } = updatePostDto;
  //     await this.postsService.update(id, title, content);
  //   }
  //
  //   @Delete(':id')
  //   async remove(@Param('id') id: number) {
  //     await this.postsService.remove(id);
  //   }
}

import { Controller, Post, Get, Body, UseGuards, Query, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUser } from '../decorator/getUser.decorator';
import { GetUserDto } from '../users/dto/get.user.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'The post has been successfully created.' })
  @ApiBody({ type: CreatePostDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@GetUser() user: GetUserDto, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(user, createPostDto);
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Return all posts.' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit number of posts per page', type: Number })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAllMayPosts(
    @GetUser() user: GetUserDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.postsService.findAllMayPosts(user, page, limit);
  }

  @ApiOperation({ summary: 'Find post by ID' })
  @ApiResponse({ status: 200, description: 'Post found.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.postsService.getPostById(id);
  }

  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({ status: 200, description: 'The post has been successfully updated.' })
  @ApiBody({ type: UpdatePostDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@GetUser() user: GetUserDto, @Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(user, id, updatePostDto);
  }

  @ApiOperation({ summary: 'Soft delete a post by ID' })
  @ApiResponse({ status: 200, description: 'The post has been successfully soft deleted.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async softDelete(@Param('id') id: number, @GetUser() user: GetUserDto): Promise<void> {
    return this.postsService.softDeletePost(id, user);
  }
}

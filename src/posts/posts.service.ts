import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUserDto } from '../users/dto/get.user.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Injectable()
export class PostsService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    logger.setContext(PostsService.name);
  }

  private async validateUserAndGetFromDB(user: GetUserDto): Promise<User> {
    if (!user || !user.username) {
      this.logger.error('Invalid users or username');
      throw new BadRequestException('Invalid users or username');
    }
    const userFromDB = await this.userRepository.findOne({ where: { username: user.username } });
    if (!userFromDB) {
      this.logger.warn(`User not found with username: ${user.username}`);
      throw new NotFoundException('User not found');
    }
    return userFromDB;
  }

  @ApiOperation({ summary: 'Create a new post' })
  async create(user: GetUserDto, createPostDto: CreatePostDto): Promise<Post> {
    const userFromDB = await this.validateUserAndGetFromDB(user);
    createPostDto.username = user.username;
    const post = this.postRepository.create(createPostDto);
    post.user = Promise.resolve(userFromDB);
    return this.postRepository.save(post);
  }

  @ApiOperation({ summary: 'Get all posts by page' })
  async findAllMayPosts(user: GetUserDto, page = 1, limit = 10) {
    const userFromDB = await this.validateUserAndGetFromDB(user);
    const [posts, total] = await this.postRepository.findAndCount({
      where: { user: { id: userFromDB.id } },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        created_at: 'DESC',
      },
    });
    return {
      data: posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @ApiOperation({ summary: 'Get post by ID' })
  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  @ApiOperation({ summary: 'Update post by ID' })
  async update(user: GetUserDto, id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const userFromDB = await this.validateUserAndGetFromDB(user);
    const post = await this.postRepository.findOne({
      where: {
        id,
        user: { id: userFromDB.id },
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    if (updatePostDto.title) {
      post.title = updatePostDto.title;
    }
    if (updatePostDto.content) {
      post.content = updatePostDto.content;
    }
    return this.postRepository.save(post);
  }

  @ApiOperation({ summary: 'Soft delete post by ID' })
  async softDeletePost(id: number, user: GetUserDto): Promise<void> {
    const userFromDB = await this.validateUserAndGetFromDB(user);
    const post = await this.postRepository.findOne({
      where: {
        id,
        user: { id: userFromDB.id },
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    await this.postRepository.softDelete(post.id);
  }
}

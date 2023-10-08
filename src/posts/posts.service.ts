import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

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

  @ApiProperty({ description: 'Create posts' })
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { username } = createPostDto;

    try {
      if (!username) {
        this.logger.error(`Invalid username: ${username}`);
        throw new BadRequestException('Invalid username');
      }

      this.logger.info(`Username: ${username}`);
      this.logger.info(`Attempting to create post: ${JSON.stringify(createPostDto)}`);

      const user = await this.userRepository.findOne({ where: { username: username } });
      if (!user) {
        this.logger.warn(`User not found with username: ${username}`);
        throw new NotFoundException('User not found');
      }

      const post = this.postRepository.create(createPostDto);
      post.user = Promise.resolve(user);

      this.logger.info(`Successfully created post`);
      return await this.postRepository.save(post);
    } catch (error) {
      this.logger.error(`Error occurred while creating post: ${error.message}`);
      throw error;
    }
  }

  @ApiProperty({ description: 'Gets all posts' })
  async findAll(): Promise<Post[]> {
    try {
      this.logger.info('Fetching all posts');
      return await this.postRepository.find();
    } catch (error) {
      this.logger.error(`Error occurred while fetching all posts: ${error.message}`);
      throw error;
    }
  }

  @ApiProperty({ description: 'Updates a post by ID' })
  async update(id: number, updatePostDto: CreatePostDto): Promise<void> {
    try {
      this.logger.info(`Attempting to update post with ID: ${id}`);

      const post = await this.postRepository.findOne({ where: { id } });
      if (!post) {
        this.logger.warn(`Post not found with ID: ${id}`);
        throw new NotFoundException('Post not found');
      }

      this.logger.info(`Successfully updated post with ID: ${id}`);
      await this.postRepository.update(id, updatePostDto);
    } catch (error) {
      this.logger.error(`Error occurred while updating post: ${error.message}`);
      throw error;
    }
  }

  @ApiProperty({ description: 'Deletes a post by ID' })
  async delete(id: number): Promise<void> {
    try {
      this.logger.info(`Attempting to delete post with ID: ${id}`);

      const result = await this.postRepository.softDelete(id);
      if (result.affected === 0) {
        this.logger.warn(`Post not found with ID: ${id}`);
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      this.logger.info(`Successfully deleted post with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error occurred while deleting post: ${error.message}`);
      throw error;
    }
  }
}

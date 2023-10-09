import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { GetUserDto } from '../user/dto/get.user.dto';
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

  @ApiProperty({ description: 'Create posts' })
  async create(user: GetUserDto, createPostDto: CreatePostDto): Promise<Post> {
    try {
      if (!user || !user.username) {
        this.logger.error('Invalid user or username');
        throw new BadRequestException('Invalid user or username');
      }

      this.logger.info(`Username from JWT: ${user.username}`);

      const userFromDB = await this.userRepository.findOne({ where: { username: user.username } });
      if (!userFromDB) {
        this.logger.warn(`User not found with username: ${user.username}`);
        throw new NotFoundException('User not found');
      }

      createPostDto.username = user.username;

      const post = this.postRepository.create(createPostDto);
      post.user = Promise.resolve(userFromDB);

      this.logger.info(`Successfully created post`);
      return await this.postRepository.save(post);
    } catch (error) {
      this.logger.error(`Error occurred while creating post: ${error.message}`);
      throw error;
    }
  }

  async findAllMayPosts(user: GetUserDto, page: number = 1, limit: number = 10) {
    // Проверяем, есть ли пользователь
    if (!user || !user.username) {
      this.logger.error(`Invalid user`);
      throw new Error('Invalid user');
    }

    // Найти пользователя в базе данных
    const userFromDb = await this.userRepository.findOne({ where: { username: user.username } });

    if (!userFromDb) {
      this.logger.warn(`User not found with username: ${user.username}`);
      throw new NotFoundException('User not found');
    }

    // Получить посты с пагинацией и сортировкой
    const [posts, total] = await this.postRepository.findAndCount({
      where: { user: { id: userFromDb.id } }, // связь с пользователем
      take: limit, // сколько записей на одну страницу
      skip: (page - 1) * limit, // смещение
      order: {
        created_at: 'DESC', // сортировка по убыванию даты создания
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

  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  @ApiProperty({ description: 'Updates a post by ID' })
  async update(user: GetUserDto, id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      if (!user || !user.username) {
        this.logger.error('Invalid user or username');
        throw new BadRequestException('Invalid user or username');
      }

      const userFromDB = await this.userRepository.findOne({ where: { username: user.username } });
      if (!userFromDB) {
        this.logger.warn(`User not found with username: ${user.username}`);
        throw new NotFoundException('User not found');
      }

      const post = await this.postRepository.findOne({
        where: {
          id,
          user: { id: userFromDB.id },
        },
      });

      if (!post) {
        this.logger.warn(`Post not found with id: ${id}`);
        throw new NotFoundException(`Post with id ${id} not found`);
      }

      if (updatePostDto.title) {
        post.title = updatePostDto.title;
      }

      if (updatePostDto.content) {
        post.content = updatePostDto.content;
      }

      await this.postRepository.save(post);
      this.logger.info(`Successfully updated post with id ${id}`);
      return post;
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

  async softDeletePost(id: number, user: GetUserDto): Promise<void> {
    // Проверяем, есть ли пользователь
    if (!user || !user.username) {
      this.logger.error(`Invalid user`);
      throw new Error('Invalid user');
    }

    // Найти пользователя в базе данных
    const userFromDb = await this.userRepository.findOne({ where: { username: user.username } });

    if (!userFromDb) {
      this.logger.warn(`User not found with username: ${user.username}`);
      throw new NotFoundException('User not found');
    }

    // Найти пост с указанным ID и принадлежащий пользователю
    const post = await this.postRepository.findOne({
      where: {
        id,
        user: { id: userFromDb.id }, // используем ID пользователя для фильтрации
      },
    });

    if (!post) {
      this.logger.warn(`Post not found with id: ${id}`);
      throw new NotFoundException('Post not found');
    }

    // Мягкое удаление поста
    await this.postRepository.softDelete(post.id);
  }
}

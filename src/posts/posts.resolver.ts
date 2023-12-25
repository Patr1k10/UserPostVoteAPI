import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { GetUserDto } from '../users/dto/get.user.dto';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  async createPost(@Args('input') input: CreatePostDto, @Args('user') user: GetUserDto) {
    return this.postsService.create(user, input);
  }

  @Query(() => [Post])
  async findAllPosts(@Args('user') user: GetUserDto, @Args('page') page: number, @Args('limit') limit: number) {
    return this.postsService.findAllMayPosts(user, page, limit);
  }

  @Query(() => Post)
  async findOnePost(@Args('id', { type: () => Int }) id: number) {
    return this.postsService.getPostById(id);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('user') user: GetUserDto,
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePostInput') updatePostInput: UpdatePostDto,
  ) {
    return this.postsService.update(user, id, updatePostInput);
  }

  @Mutation(() => Post)
  async removePost(@Args('id', { type: () => Int }) id: number, @Args('user') user: GetUserDto) {
    return this.postsService.softDeletePost(id, user);
  }
}

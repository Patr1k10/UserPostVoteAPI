import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UsersService } from './users.service';
import { CreateUsersInput } from './inputType/create.users.input';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUsersInput } from './inputType/update.users.Input';
import { UserAuthDto } from './dto/authUser.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUsersInput): Promise<CreateUserDto> {
    return this.usersService.createUser(input);
  }

  @Query(() => User)
  async getOneUser(@Args('id') id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: number,
    @Args('input') input: UpdateUsersInput,
    @Context('headers') headers: Headers,
  ): Promise<User> {
    const ifUnmodifiedSince = headers['if-unmodified-since'];
    return this.usersService.updateUser(id, input, ifUnmodifiedSince);
  }

  @Mutation(() => Boolean)
  async softDeleteUser(@Args('id') id: number): Promise<boolean> {
    await this.usersService.softDeleteUser(id);
    return true;
  }

  @Query(() => [User])
  async findAllWithPagination(@Args('page') page: number, @Args('limit') limit: number): Promise<User[]> {
    const result = await this.usersService.findAllWithPagination(page, limit);
    return result.users;
  }

  @Mutation(() => String)
  async login(@Args('input') input: UserAuthDto): Promise<string> {
    const { access_token } = await this.usersService.login(input);

    if (!access_token) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return access_token;
  }
}

import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  Headers,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LastModifiedInterceptor } from '../interceptor/last-modified.interceptor';
import { HideFieldsInterceptor } from '../interceptor/hideFields.interceptor';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<UserDto> {
    return this.userService.createUser(userDto);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: GetUserDto,
    @Headers('if-unmodified-since') ifUnmodifiedSince: string,
  ): Promise<User> {
    const user = await this.userService.getUserById(Number(id));

    if (ifUnmodifiedSince && new Date(ifUnmodifiedSince).getTime() !== new Date(user.updated_at).getTime()) {
      throw new BadRequestException('Resource has been modified');
    }

    return this.userService.updateUser(Number(id), updateUserDto);
  }
  @UseInterceptors(LastModifiedInterceptor)
  @UseInterceptors(HideFieldsInterceptor)
  @Get(':id')
  async getUserById(@Param() params: GetUserDto): Promise<GetUserDto> {
    return this.userService.getUserById(params.id);
  }
  @UseInterceptors(HideFieldsInterceptor)
  @Get()
  findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
    return this.userService.findAllWithPagination(page, limit);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async softDeleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.softDeleteUser(Number(id));
  }
}

// user.controller.ts
import { Controller, Post, Body, Put, Param, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { User } from './entities/user.entity';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userDto: UserDto): Promise<UserDto> {
    // Используйте UserDto вместо User
    return this.userService.createUser(userDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt')) // Используйте AuthGuard для проверки JWT-токена
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto): Promise<User> {
    return this.userService.updateUser(Number(id), updateUserDto);
  }

  @Get(':id')
  async getUserById(@Param() params: GetUserDto): Promise<GetUserDto> {
    return this.userService.getUserById(params.id);
  }

  @Get()
  findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
    return this.userService.findAllWithPagination(page, limit);
  }

  // Другие методы, включая получение списка пользователей и т. д.
}

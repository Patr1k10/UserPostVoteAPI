import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserUpdateDto } from './dto/updateUser.dto';
import { HideFieldsInterceptor } from '../interceptor/hideFields.interceptor';
import { LastModifiedInterceptor } from '../interceptor/last-modified.interceptor';
import { Roles } from '../decorator/roles.decorator';
import { RolesGuard } from '../guard/roles.guard';
import { UsersService } from './users.service';
import { GetUserDto } from './dto/get.user.dto';
import { GetUserByIdDto } from './dto/get.userById.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUser } from '../decorator/getUser.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Create a new users' })
  @Post()
  async createUser(@Body() userDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Update an existing users by ID' })
  @ApiParam({ name: 'id', description: 'ID of users to update' })
  @ApiBearerAuth()
  @Put(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UserUpdateDto,
    @Headers('if-unmodified-since') ifUnmodifiedSince: string,
  ): Promise<UserUpdateDto> {
    return this.userService.updateUser(Number(id), updateUserDto, ifUnmodifiedSince);
  }

  @ApiOperation({ summary: 'Get a users by ID' })
  @ApiParam({ name: 'id', description: 'ID of users to fetch' })
  @UseInterceptors(LastModifiedInterceptor)
  @UseInterceptors(HideFieldsInterceptor)
  @Get(':id')
  async getUserById(@Param() params?: GetUserByIdDto): Promise<GetUserDto> {
    return this.userService.getUserById(params.id);
  }

  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', description: 'Page number' })
  @ApiQuery({ name: 'limit', description: 'Limit number' })
  @UseInterceptors(HideFieldsInterceptor)
  @UseInterceptors(LastModifiedInterceptor)
  @Get()
  async findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
    return this.userService.findAllWithPagination(page, limit);
  }

  @ApiOperation({ summary: 'Soft-delete a users by ID' })
  @ApiParam({ name: 'id', description: 'ID of users to soft-delete' })
  @ApiBearerAuth()
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async softDeleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.softDeleteUser(Number(id));
  }

  @ApiOperation({ summary: 'Get a signed URL for avatar upload' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('getSignedUrl')
  async getSignedUrl(@GetUser() user: GetUserDto): Promise<{ uploadUrl: string }> {
    const uploadUrl = await this.userService.getSignedUrl(user);
    return { uploadUrl };
  }

  @ApiOperation({ summary: 'Upload avatar' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file, @Body('uploadUrl') uploadUrl: string): Promise<{ message: string }> {
    await this.userService.uploadAvatar(uploadUrl, file.buffer, file.mimetype);
    return { message: 'Avatar uploaded successfully' };
  }

  @ApiOperation({ summary: 'Find users by various fields' })
  @ApiQuery({ name: 'username', required: false })
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'firstName', required: false })
  @ApiQuery({ name: 'lastName', required: false })
  @UseInterceptors(LastModifiedInterceptor)
  @UseInterceptors(HideFieldsInterceptor)
  @Get('search')
  async findUsersByFields(@Query() query: GetUserDto): Promise<GetUserDto> {
    return this.userService.findUserByFields(query);
  }
}

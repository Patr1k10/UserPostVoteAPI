import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  BadRequestException,
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
import { UserService } from './user.service';
import { GetUserDto } from './dto/get.user.dto';
import { GetUserByIdDto } from './dto/get.userById.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUser } from '../decorator/getUser.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async createUser(@Body() userDto: CreateUserDto): Promise<CreateUserDto> {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Update an existing user by ID' })
  @ApiParam({ name: 'id', description: 'ID of user to update' })
  @ApiBearerAuth()
  @Put(':id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UserUpdateDto,
    @Headers('if-unmodified-since') ifUnmodifiedSince: string,
  ): Promise<UserUpdateDto> {
    const user = await this.userService.getUserById(Number(id));
    if (ifUnmodifiedSince && new Date(ifUnmodifiedSince).getTime() !== new Date(user.updated_at).getTime()) {
      throw new BadRequestException('Resource has been modified');
    }
    return this.userService.updateUser(Number(id), updateUserDto);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of user to fetch' })
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
  findAll(@Query('page', ParseIntPipe) page: number = 1, @Query('limit', ParseIntPipe) limit: number = 10) {
    return this.userService.findAllWithPagination(page, limit);
  }

  @ApiOperation({ summary: 'Soft-delete a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of user to soft-delete' })
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
}

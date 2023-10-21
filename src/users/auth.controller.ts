import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserAuthDto } from './dto/authUser.dto';

@ApiTags('Authentication') //
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Login users' })
  @ApiBody({ type: UserAuthDto, description: 'User credentials' })
  @ApiResponse({ status: 201, description: 'Successfully logged in', type: String })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('login')
  async login(@Body() userDto: UserAuthDto) {
    const { access_token } = await this.userService.login(userDto);
    return { access_token };
  }
}

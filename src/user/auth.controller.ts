import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UserAuthDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('Authentication') //
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: UserAuthDto, description: 'User credentials' })
  @ApiResponse({ status: 201, description: 'Successfully logged in', type: String })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('login')
  async login(@Body() userDto: UserAuthDto) {
    const user = await this.userService.validateUser(userDto.username, userDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.userService.login(user);
    return { access_token: token.access_token };
  }
}

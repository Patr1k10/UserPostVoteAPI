import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}
  @Post('login')
  async login(@Body() userDto: UserDto) {
    const user = await this.userService.validateUser(userDto.username, userDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.userService.login(user);
    return { access_token: token.access_token };
  }
}

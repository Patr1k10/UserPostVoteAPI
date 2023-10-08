import * as dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../user/user.service';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const userId = parseInt(payload.sub as string, 10);

    if (isNaN(userId) || userId <= 0) {
      console.log(`Invalid user ID in JWT payload: ${payload.sub}`);
      throw new UnauthorizedException('Invalid JWT payload');
    }

    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User is not found');
    }

    return user;
  }
}

// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt'; // Импортируйте необходимые модули
import * as dotenv from 'dotenv';
import { UserService } from '../user.service';
import { JwtPayload } from 'jsonwebtoken'; // Импортируйте ваш сервис пользователя
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY, // Замените на ваш секретный ключ
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    // Валидация пользователя на основе данных из payload
    const userId = parseInt(payload.sub as string, 10); // Преобразуем sub в число

    // Найдите пользователя в базе данных по ID
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Если пользователь существует, верните его данные
    return user;
  }
}

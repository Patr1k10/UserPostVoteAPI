// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '12h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ], // Импортируем UserModule, чтобы UserService был доступен
  providers: [JwtStrategy],
  exports: [JwtStrategy], // Экспортируем JwtStrategy, чтобы она была доступна в других модулях
})
export class AuthModule {}

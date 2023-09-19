// app.module.ts
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User } from './user/entities/user.entity';
import { DatabaseModule } from './db/database.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './user/auth.controller';
import { JwtStrategy } from './user/dto/jwt.strategy';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRET_KEY, // Здесь должен быть ваш секретный ключ для JWT
      signOptions: { expiresIn: '1h' }, // Настройка срока действия токена
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, Logger, UserModule, JwtStrategy],
})
export class AppModule {}

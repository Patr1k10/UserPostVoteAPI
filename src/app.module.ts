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
import { JwtStrategy } from './guard/jwt.strategy';
import { VoteController } from './vote/vote.controller';
import { VoteService } from './vote/vote.service';
import { Vote } from './vote/entities/vote.entity';
import { LoggerModule } from 'nestjs-pino';
import { AppConfig } from './app.config';

dotenv.config();

@Module({
  imports: [
    LoggerModule.forRoot(AppConfig.getLoggerConfig()),

    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '12h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Vote]),
  ],
  controllers: [UserController, AuthController, VoteController],
  providers: [UserService, Logger, UserModule, JwtStrategy, VoteService],
})
export class AppModule {}

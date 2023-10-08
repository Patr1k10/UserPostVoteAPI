import * as dotenv from 'dotenv';
import { JwtModule } from '@nestjs/jwt';
import { Logger, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './user/auth.controller';
import { JwtStrategy } from './guard/jwt.strategy';
import { DatabaseModule } from './db/database.module';
import { AppConfig } from './app.config';
import { User } from './entities/user.entity';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { Vote } from './entities/vote.entity';
import { VoteController } from './vote/vote.controller';
import { VoteService } from './vote/vote.service';
import { PostsModule } from './posts/posts.module';
import { Post } from './entities/post.entity';

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
    TypeOrmModule.forFeature([User, Vote, Post]),
    PostsModule,
  ],
  controllers: [UserController, AuthController, VoteController],
  providers: [UserService, Logger, UserModule, JwtStrategy, VoteService],
})
export class AppModule {}

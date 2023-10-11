import * as dotenv from 'dotenv';
import { Logger, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './db/database.module';
import { AppConfig } from './app.config';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { VoteModule } from './vote/vote.module';
import { AuthModule } from './guard/auth.module';

dotenv.config();

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot(AppConfig.getLoggerConfig()),
    DatabaseModule,
    PostsModule,
    UserModule,
    VoteModule,
    AuthModule,
  ],
  controllers: [],
  providers: [Logger, EventEmitter2],
  exports: [EventEmitter2],
})
export class AppModule {}

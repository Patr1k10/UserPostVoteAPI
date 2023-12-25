import { Logger, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { transformAndValidateSync } from 'class-transformer-validator';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DatabaseModule } from './db/database.module';
import { AppConfig } from './app.config';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { VoteModule } from './vote/vote.module';
import { AuthModule } from './guard/auth.module';
import { Environment } from './config/environment';
import { UserResolver } from './users/users.resolver';
import { PostsResolver } from './posts/posts.resolver';
import { VoteResolver } from './vote/vote.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      playground: true,
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot(AppConfig.getLoggerConfig()),
    DatabaseModule,
    PostsModule,
    UsersModule,
    VoteModule,
    AuthModule,
  ],
  controllers: [],
  providers: [Logger, { provide: Environment, useValue: transformAndValidateSync(Environment, process.env) }],
  exports: [],
})
export class AppModule {}

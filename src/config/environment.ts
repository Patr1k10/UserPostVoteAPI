import { IsString, IsInt, IsBoolean, IsUrl } from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Environment {
  @IsString()
  DATABASE_TYPE: string;

  @IsString()
  DATABASE_HOST: string;

  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  DATABASE_SYNCHRONIZE: boolean;

  @IsString()
  DATABASE_NAME: string;

  @IsString()
  SECRET_KEY: string;

  @IsUrl()
  AWS_SQS_URL: string;

  @IsString()
  AWS_REGION: string;

  @IsUrl()
  URL_API_LAMBDA: string;

  PORT: number;
}

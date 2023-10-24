import { IsString, IsInt, IsUrl, IsBoolean } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Type } from 'class-transformer';

@Injectable()
export class Environment {
  @IsString()
  DATABASE_TYPE: string;

  @IsString()
  DATABASE_HOST: string;

  @Type(() => Number)
  @IsInt()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @Type(() => Boolean)
  @IsBoolean()
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

  @Type(() => Number)
  @IsInt()
  PORT: number;
}

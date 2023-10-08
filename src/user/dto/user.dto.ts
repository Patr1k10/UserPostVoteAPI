// eslint-disable-next-line max-classes-per-file
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UserDto {
  @ApiProperty({ description: 'The ID of the user' })
  id: number;

  @ApiProperty({ description: 'The username', minLength: 3, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username: string;

  @ApiProperty({ description: 'The first name of the user', minLength: 1, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', minLength: 1, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  lastName: string;

  @ApiProperty({ description: 'The password', minLength: 6, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;

  @ApiProperty({ description: 'The role of the user', enum: ['admin', 'moderator'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['admin', 'moderator'])
  role: string;

  @ApiProperty({ description: 'The rating of the user' })
  rating: number;

  @ApiProperty({ description: 'The creation date of the user', required: false })
  @IsOptional()
  @IsDateString()
  created_at?: Date;

  @ApiProperty({ description: 'The updated date of the user', required: false })
  @IsOptional()
  @IsDateString()
  updated_at?: Date;

  @ApiProperty({ description: 'The deleted date of the user', required: false })
  @IsOptional()
  @IsDateString()
  deleted_at?: Date;
}

export class UserUpdateDto {
  @ApiPropertyOptional({ description: 'Updated username', minLength: 3, maxLength: 30 })
  @IsOptional()
  @IsString()
  @Length(3, 30)
  username: string;

  @ApiPropertyOptional({ description: 'Updated first name', minLength: 1, maxLength: 30 })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  firstName: string;

  @ApiPropertyOptional({ description: 'Updated last name', minLength: 1, maxLength: 30 })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  lastName: string;

  @ApiPropertyOptional({ description: 'Updated password', minLength: 6, maxLength: 30 })
  @IsOptional()
  @IsString()
  @Length(6, 30)
  password: string;

  @ApiPropertyOptional({ description: 'The role of the user', enum: ['admin', 'moderator'] })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'moderator'])
  role?: string;
}

export class CreateUserDto {
  @ApiProperty({ description: 'The username', minLength: 3, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username: string;

  @ApiProperty({ description: 'The first name of the user', minLength: 1, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  firstName: string;

  @ApiProperty({ description: 'The last name of the user', minLength: 1, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  lastName: string;

  @ApiProperty({ description: 'The password', minLength: 6, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;

  @ApiPropertyOptional({ description: 'The role of the user', enum: ['admin', 'moderator'] })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'moderator'])
  role?: string;
}
export class UserAuthDto {
  @ApiProperty({ description: 'The username', minLength: 3, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username?: string;

  @ApiProperty({ description: 'The password', minLength: 6, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password?: string;

  id: number;
}

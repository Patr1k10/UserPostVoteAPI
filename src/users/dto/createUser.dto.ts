import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  id?: number;

  @ApiProperty({ description: 'The username', minLength: 3, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username?: string;

  @ApiProperty({ description: 'The first name of the users', minLength: 1, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  firstName?: string;

  @ApiProperty({ description: 'The last name of the users', minLength: 1, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  lastName?: string;

  @ApiProperty({ description: 'The password', minLength: 6, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password?: string;

  @ApiPropertyOptional({ description: 'The role of the users', enum: ['admin', 'moderator'] })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'moderator'])
  role?: string;

  deleted_at?: Date | null;
}

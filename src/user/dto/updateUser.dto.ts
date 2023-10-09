import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

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

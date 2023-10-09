import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

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

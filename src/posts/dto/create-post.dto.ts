import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsInt } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    maxLength: 500,
    example: 'My first post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  username: string;
}

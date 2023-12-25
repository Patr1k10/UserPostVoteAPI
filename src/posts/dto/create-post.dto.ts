import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    maxLength: 500,
    example: 'My first post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Field()
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post.',
  })
  @IsString()
  @IsNotEmpty()
  @Field()
  content: string;

  @ApiProperty({
    description: 'The username of the post creator',
    example: 'john_doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Field()
  username?: string;
}

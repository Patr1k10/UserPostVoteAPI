import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    type: String,
    maxLength: 500,
    required: false,
    example: 'This is a sample title',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  title?: string;

  @ApiProperty({
    description: 'Content of the post',
    type: String,
    required: false,
    example: 'This is a sample content',
  })
  @IsString()
  @IsOptional()
  content?: string;
}

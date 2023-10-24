import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType() // Добавьте декоратор InputType к классу
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
  @Field({ nullable: true }) // Укажите nullable: true, чтобы это поле могло быть null
  title?: string;

  @ApiProperty({
    description: 'Content of the post',
    type: String,
    required: false,
    example: 'This is a sample content',
  })
  @IsString()
  @IsOptional()
  @Field({ nullable: true }) // Укажите nullable: true, чтобы это поле могло быть null
  content?: string;
}

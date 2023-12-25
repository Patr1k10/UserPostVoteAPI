import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class GetUserDto {
  @ApiProperty({ description: 'The ID of the users' })
  @IsNumber()
  @IsNotEmpty()
  @Field()
  readonly id?: number;

  @ApiProperty({ description: 'The username', minLength: 3, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username?: string;

  @ApiProperty({ description: 'The first name', minLength: 1, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  firstName?: string;

  @ApiProperty({ description: 'The last name', minLength: 1, maxLength: 30 })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  lastName?: string;

  role?: string;

  @Exclude()
  updated_at?: Date;

  @Exclude()
  password?: string;

  @Exclude()
  created_at?: Date;

  @Exclude()
  deleted_at?: Date;
}

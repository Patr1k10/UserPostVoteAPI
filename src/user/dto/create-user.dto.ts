import { IsString, IsNotEmpty, Length, IsOptional, IsDateString } from 'class-validator';

export class UserDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;

  @IsOptional()
  @IsDateString()
  created_at?: Date;

  @IsOptional()
  @IsDateString()
  updated_at?: Date;

  @IsOptional()
  @IsDateString()
  deleted_at?: Date;
}

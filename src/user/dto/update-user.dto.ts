import { IsOptional, IsString, Length } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  @Length(3, 30)
  username: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  firstName: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  lastName: string;

  @IsOptional()
  @IsString()
  @Length(6, 30)
  password: string;
}

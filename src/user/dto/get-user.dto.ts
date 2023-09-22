import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';
import { Exclude } from 'class-transformer';

export class GetUserDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

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

  @Exclude()
  updated_at?: Date;

  @Exclude()
  password: string;

  @Exclude()
  created_at?: Date;

  @Exclude()
  deleted_at?: Date;
}

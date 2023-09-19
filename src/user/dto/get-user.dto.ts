import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';

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

}

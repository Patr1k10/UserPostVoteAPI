//create-user.dto.ts
import { IsString, IsNotEmpty, Length } from 'class-validator';

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

  constructor(username: string, firstName: string, lastName: string, password: string) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }
}

import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, Length, IsOptional, IsIn } from 'class-validator';

@InputType()
export class CreateUsersInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  username: string;

  @Field({ description: 'The first name of the users', nullable: false })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  firstName: string;

  @Field({ description: 'The last name of the users', nullable: false })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  lastName: string;

  @Field({ description: 'The password', nullable: false })
  @IsString()
  @IsNotEmpty()
  @Length(6, 30)
  password: string;

  @Field({ description: 'The role of the users', nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'moderator'])
  role?: string;

  deleted_at?: Date | null;
}

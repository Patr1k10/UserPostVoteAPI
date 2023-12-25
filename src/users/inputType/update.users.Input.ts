import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional, IsString, Length, IsIn } from 'class-validator';
import { CreateUsersInput } from './create.users.input';

@InputType()
export class UpdateUsersInput extends PartialType(CreateUsersInput) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(3, 30)
  username?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 30)
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 30)
  lastName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(6, 30)
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'moderator'])
  role?: string;
}

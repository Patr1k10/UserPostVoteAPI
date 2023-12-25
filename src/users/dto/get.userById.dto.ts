import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserByIdDto {
  @ApiProperty({ description: 'The ID of the users' })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  updated_at?: Date;
}

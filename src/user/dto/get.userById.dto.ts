import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserByIdDto {
  @ApiProperty({ description: 'The ID of the user' })
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}

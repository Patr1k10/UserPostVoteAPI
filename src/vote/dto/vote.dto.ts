import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min, NotEquals } from 'class-validator';

export class ProcessVoteDTO {
  @ApiProperty({ description: 'Username of the voter' })
  @IsString()
  fromUsername: string;

  @ApiProperty({ description: 'Username of the one being voted for' })
  @IsString()
  toUsername: string;

  @ApiProperty({ description: 'Value of the vote (-1 or 1)', minimum: -1, maximum: 1 })
  @IsNumber()
  @Min(-1)
  @Max(1)
  @NotEquals(0)
  value: number;
}

import { IsNumber, IsString,  Max, Min, NotEquals } from 'class-validator';

export class ProcessVoteDTO {
  @IsString()
  fromUsername: string;

  @IsString()
  toUsername: string;

  @IsNumber()
  @Min(-1)
  @Max(1)
  @NotEquals(0)
  value: number;
}

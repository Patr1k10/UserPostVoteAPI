import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min, NotEquals } from 'class-validator';

export class ProcessVoteDTO {
  @ApiHideProperty()
  @IsNumber()
  fromUserId: number;

  @ApiProperty({
    description: 'Type of the entity being voted for',
    type: String,
    example: 'Post',
  })
  @IsString()
  entityType: string;

  @ApiProperty({
    description: 'ID of the entity being voted for',
    type: Number,
    example: 1,
  })
  @IsNumber()
  entityId: number;

  @ApiProperty({
    description: 'Value of the vote (-1 or 1)',
    type: Number,
    minimum: -1,
    maximum: 1,
    example: 1,
  })
  @IsNumber()
  @Min(-1)
  @Max(1)
  @NotEquals(0)
  value: number;
}

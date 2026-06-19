import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ListEvaluationCalculationHistoryDto {
  @ApiProperty({ type: Number, example: 0 })
  @IsNotEmpty({ message: 'offset cannot be blank' })
  offset: number;

  @ApiProperty({ type: Number, example: 20 })
  @IsNotEmpty({ message: 'limit cannot be blank' })
  limit: number;

  @ApiProperty({ type: String, example: 1 })
  @IsNotEmpty({ message: 'type cannot be blank' })
  type: string;

  @ApiProperty({ type: String, example: 2 })
  @IsNotEmpty({ message: 'status cannot be blank' })
  status: string;

  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty({ message: 'current cannot be blank' })
  current: number;

  @ApiProperty({ type: Boolean, example: true })
  search?: number;
}

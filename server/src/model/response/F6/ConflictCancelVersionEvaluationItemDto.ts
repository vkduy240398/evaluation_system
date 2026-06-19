import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../ResponseDto';
import { HttpStatus } from '@nestjs/common';

export class ConflictCancelVersionEvaluationItemDto extends ResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.CONFLICT })
  statusCode: number;

  @ApiProperty({ type: String, example: 'No status valid or Date' })
  message: string;
}

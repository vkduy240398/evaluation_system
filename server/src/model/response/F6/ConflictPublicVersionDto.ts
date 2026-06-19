import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from '../ResponseDto';
import { HttpStatus } from '@nestjs/common';

export class ConflictPublicVersionDto extends ResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.CONFLICT })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Date invalid' })
  message: string;
}

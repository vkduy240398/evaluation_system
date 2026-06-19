import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ type: String, example: '' })
  message: string;

  @ApiProperty({ type: Number, example: 1700799663392 })
  timeStamp: number;
}

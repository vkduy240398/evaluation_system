import { ApiProperty } from '@nestjs/swagger';

export class DateResponseDto {
  @ApiProperty({ type: Number, example: 200 })
  code: number;

  @ApiProperty({ type: String, example: '2023/10/20' })
  start: string;

  @ApiProperty({ type: String, example: '2023/10/21' })
  end: string;
}

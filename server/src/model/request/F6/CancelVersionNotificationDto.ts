import { ApiProperty } from '@nestjs/swagger';

export class CancelVersionNotificationDto {
  @ApiProperty({ type: Number, example: 1, nullable: false })
  status: number;

  @ApiProperty({
    type: String,
    example: '2023-12-25T06:40:26.556Z',
    nullable: false,
  })
  updatedTime: string;

  [x: string]: any;
}

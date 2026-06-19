import { ApiProperty } from '@nestjs/swagger';

export class NotificationPeriodDto {
  @ApiProperty({ type: String, example: '目標' })
  type: string;

  @ApiProperty({ type: String, example: '2023年上期' })
  period: string;

  @ApiProperty({ type: String, example: '2023/11/23 ～ 2023/11/23' })
  datePersonal: string;

  @ApiProperty({ type: String, example: '2023/11/22 ～ 2023/11/23' })
  dateDepartment: string;
}

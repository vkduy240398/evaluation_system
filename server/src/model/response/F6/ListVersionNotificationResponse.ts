import { ApiProperty } from '@nestjs/swagger';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';

export class ListVersionNotificationResponse {
  @ApiProperty({ type: [VersionNotificationDto] })
  rows: VersionNotificationDto[];

  @ApiProperty({ type: Number, description: 'Total records', example: 20 })
  counts: number;
}

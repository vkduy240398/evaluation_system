import { ApiProperty } from '@nestjs/swagger';
import { CreationUserDto } from './CreationUserDto';

export class VersionNotificationDto {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Number, example: 2 })
  version: number;

  @ApiProperty({ type: Number, example: 0 })
  subVersion: number;

  @ApiProperty({ type: String, example: '2.0' })
  versionDisplay: string;

  @ApiProperty({ type: Number, example: 3 })
  status: number;

  @ApiProperty({ type: Number, example: 97 })
  creationUser: number;

  @ApiProperty({ type: String, example: '理由' })
  reason: string;

  @ApiProperty({
    type: String,
    example:
      '長所: JavaScript はクライアント側で広く使用されているため、Node.js を使用してサーバー側で JavaScript を使用すると、統一言語によるフルスタック開発が可能になります。 イベント駆動型のノンブロッキング I/O モデルで知られており、多数の同時接続の処理に適しています。',
  })
  content: string;

  @ApiProperty({ type: String, example: '' })
  publicDate: string;

  @ApiProperty({ type: String, example: '2023-07-12T09:34:54.983Z' })
  updatedTime: Date;

  @ApiProperty({ type: String, example: '' })
  lastUpdatedTime: string;

  @ApiProperty()
  user?: CreationUserDto;

  @ApiProperty({ type: Boolean, example: false })
  existEditingVersion: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import { info } from 'console';

const datas = [
  {
    approverUser: {
      id: 4,
      fullName: 'User3',
    },
    createdTime: '2023-10-20T08:05:57.677Z',
    comment: 'asfsaf',
    status: '公開',
  },
  {
    approverUser: {
      id: 4,
      fullName: 'User3',
    },
    createdTime: '2023-10-20T08:05:01.993Z',
    comment: 'hah',
    status: '承認',
  },
];

class Info {
  @ApiProperty({ type: String, example: '1.0' })
  version: string;

  @ApiProperty({ type: String, example: '000299: Department 199' })
  department: string;
}

export class GetHistoryApproveContentDto {
  @ApiProperty({ type: info })
  info: Info;

  @ApiProperty({ type: [], example: datas })
  approvalHistories: any[];
}

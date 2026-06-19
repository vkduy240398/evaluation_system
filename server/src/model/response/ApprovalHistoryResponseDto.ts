import { ApiProperty } from '@nestjs/swagger';
import { Mock } from 'src/enum/Mock';
import { EvaluationDto } from './EvaluationDto';
import { UserDto } from '../generic/UserDto';

class ApprovalUserDto {
  @ApiProperty({
    type: Number,
    description: 'Id of approver',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Full name of approver',
    example: Mock.fullName,
  })
  fullName: string;
}

export class EvaluatorDto {
  @ApiProperty({
    type: Number,
    description: 'Id of evaluator',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: 'Full name of evaluator',
    example: Mock.fullName,
  })
  fullName: string;

  @ApiProperty({
    type: Number,
    description: 'Order of evaluator',
    example: 2,
  })
  evaluationOrder: number;
}

export class ApprovalHistoryDto {
  @ApiProperty({
    type: Number,
    description: 'Evaluation id',
    example: 1,
  })
  evaluationId: number;

  @ApiProperty({
    type: String,
    description: 'Comment of approver/receiver',
    example: Mock.sendBackComment,
  })
  comment: string;

  @ApiProperty({
    type: Number,
    description: 'Receiver order',
    example: null,
  })
  receiverOrder: number;

  @ApiProperty({
    type: String,
    description: 'Status of history',
    example: Mock.statusApprove,
  })
  status: string;

  @ApiProperty({
    type: Number,
    description: 'Type of history',
    example: 0,
  })
  type: number;

  @ApiProperty({
    type: ApprovalUserDto,
    description: 'Approver user',
  })
  approverUser: ApprovalUserDto;

  @ApiProperty({
    type: ApprovalUserDto,
    description: 'Receiver user',
    example: null,
  })
  receiverUser: ApprovalUserDto;

  @ApiProperty({
    type: Date,
    description: 'Created date',
    example: Mock.date,
  })
  createdTime: Date;
}

export class ApprovalHistoryResponseDto {
  statusCode: number;
  message: string;
  @ApiProperty()
  approvalHistories: ApprovalHistoryDto[];
  @ApiProperty()
  evaluators: EvaluatorDto[];
  @ApiProperty()
  evaluation: EvaluationDto;
  @ApiProperty()
  userDetail: UserDto;
}

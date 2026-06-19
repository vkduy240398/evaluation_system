import { EvaluationDto } from './EvaluationDto';
import { UserDto } from '../generic/UserDto';
declare class ApprovalUserDto {
    id: number;
    fullName: string;
}
export declare class EvaluatorDto {
    id: number;
    fullName: string;
    evaluationOrder: number;
}
export declare class ApprovalHistoryDto {
    evaluationId: number;
    comment: string;
    receiverOrder: number;
    status: string;
    type: number;
    approverUser: ApprovalUserDto;
    receiverUser: ApprovalUserDto;
    createdTime: Date;
}
export declare class ApprovalHistoryResponseDto {
    statusCode: number;
    message: string;
    approvalHistories: ApprovalHistoryDto[];
    evaluators: EvaluatorDto[];
    evaluation: EvaluationDto;
    userDetail: UserDto;
}
export {};

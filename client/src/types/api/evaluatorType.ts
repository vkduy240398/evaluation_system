import { UserEvaluationToProSkillType } from '../pages/user-evaluation/UserEvaluationType';

type ErrCallbackType = (err?: { [key: string]: string }) => void;
type StatusRejectType = '2' | '4' | '6' | '8' | '52' | '55' | '58' | '61';
export interface SendApprovedStatusType {
  evaluationId: number | string | undefined;
  comment: string;
  type: TypeApprovedStatus;
  updateTime: string;
  isF5?: boolean;
  callback?: (data: any) => void;
  errorCallback?: ErrCallbackType;
}

export interface SendRejectStatusType {
  evaluationId: number | string | undefined;
  comment: string;
  type: TypeApprovedStatus;
  statusReject: StatusRejectType;
  updateTime: string;
  isF5?: boolean;
  callback?: (data: any) => void;
  errorCallback?: ErrCallbackType;
}

export type ReceiverOrderType = 0 | 0.5 | 1 | 2;
export type TypeApprovedStatus = 0 | 1;

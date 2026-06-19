import { ErrCallbackType } from '../../contexts/types';

export interface GoalConfirm {
  callback?: (response: any) => void;
  errorCallback?: ErrCallbackType;
}

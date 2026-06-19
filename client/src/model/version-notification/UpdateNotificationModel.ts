import { CreationUserDto } from './DetailNotificationModel';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface UpdateNotificationModel {
  id: number;
  version: number;
  subVersion: number;
  status: number;
  reason: string;
  content: string;
  creationUser?: any;
  user?: CreationUserDto;
  publicDate: string;
  updatedTime?: string;
}

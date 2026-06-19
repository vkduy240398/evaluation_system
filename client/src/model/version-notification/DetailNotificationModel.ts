/* eslint-disable @typescript-eslint/no-empty-interface */
export interface DetailNotificationModel {
  id: number;
  versionDisplay?: string;
  version: number;
  subVersion: number;
  status: number;
  reason: string;
  content: string;
  creationUser?: CreationUserDto;
  user?: any;
  publicDate: string;
  updatedTime: string;
  lastUpdatedTime: string;
}

export interface CreationUserDto {
  id: number;
  fullName: string;
}

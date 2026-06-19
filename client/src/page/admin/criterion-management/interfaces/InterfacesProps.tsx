export interface User {
  fullName: string;
}
export interface ChildrenBasicBehavior {
  versionId: number;
  title: string | null;
  difficulty: string | null;
  content: string | null;
  id: string;
}
export interface DetailBasicBehavior {
  id: number;
  versionId: number;
  createdTime: string;
  creationUser: number;
  publicDate: string;
  reason: string;
  status: number;
  subVersion: number;
  type: number;
  updatedTime: string;
  statusName: string;
  updatedBy: string;
  lastUpdatedTime: string;
  version: number;
  timer: Date;
  level: number | null;
  children: ChildrenBasicBehavior[];
}
export interface DataValues {
  data: DetailBasicBehavior;
  subVersion: number;
  listPoints:
    | {
        point: number;
        id: number;
        note: string;
        versionId: number;
      }[]
    | [];
  edited?: boolean;
}

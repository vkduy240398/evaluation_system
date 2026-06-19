import dayjs from 'dayjs';
import { UploadFile } from 'antd/lib';
import { Roles } from '../constant/Roles';

export interface Feedback {
  id: number;
  subject: string;
  type: FeedbackType;
  description: string;
  status: FeedbackStatus;
  attachFiles?: string;
  creationUser: number;
  sendTime: string;
  updatedTime?: string;
  feature: string[];
  phase: string;
  createdTime: string;
  summary: string;
  relatedFeedbacks?: string[];
  role?: Roles[];
  detail?: string;
  impactScope?: FeedbackImpactScope;
}

export interface FeedbackSearchForm {
  dates?: [dayjs.Dayjs, dayjs.Dayjs];
  type: FeedbackType | null;
  status: FeedbackStatus | null;
  phase: number | null;
  feature: (string | number)[][];
  offset?: number;
  limit?: number;
  current?: number;
  impactScope?: string | null;
  keywork: string;
}

export interface FeedbackCondition {
  dates?: [Date, Date];
  type: FeedbackType | null;
  status: FeedbackStatus | null;
  phase: number | null;
  feature: (string | number)[][];

  limit: number;
  current: number;
  offset: number;
  search: boolean;
  key?: number;
  role?: string;
  keywork: string;
}

export interface FeedbackCreateForm {
  roles: Roles[];
  type: FeedbackType;
  phase: FeedbackPhase;
  features?: string[][];
  summary: string;
  detail: string;
  files?: { fileList: UploadFile[] };
}

export enum FeedbackType {
  OTHER = 0,
  BUG = 1,
  REQUEST = 2,
  QUESTION = 3,
}

export enum FeedbackPhase {
  OTHER = 0,
  GOAL = 1,
  EVALUATION = 2,
}

export enum FeedbackImpactScope {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
}

export enum FeedbackStatus {
  SAVE_DRAFT = 1,
  SUBMIT = 2,
  APPROVAL = 3,
  PENDING = 4,
  CLOSE = 5,
  IN_PROGRESS = 6,
  DONE = 7,
}

export interface FeedbackDetail {
  id: number;
  subject: string;
  type: number;
  status: FeedbackStatus;
  employee_number: string;
  full_name: string;
  level: number;
  department_name: string;
  division_name: string;
  send_time: string;
  description: string;
  attach_files: string;
  updated_time: string;
}

export interface FeedbackListData {
  id: number;
  subject: string;
  type: number;
  status: number;
  employee_number: string;
  full_name: string;
  level: number;
  department_name: string;
  division_name: string;
  send_time: string;
  attach_files: string;
}

export interface FeedbackList {
  data: FeedbackListData[];
  counts: number;
}

export interface FeedbackListSearchConditions {
  offset: number;
  limit: number;
  sortBy?: string;
  sortType?: string;
  user: string;
  dateStart: string;
  dateEnd: string;
  typeFeedback: string; // "0,1"
  statusFeedback: string; // "2,3,4,5,6,7"
  department: string;
  current?: number;
  search?: boolean;
}

export interface INonRelatedFeedbackSearchForm {
  type: FeedbackType | null;
  phase: FeedbackPhase | null;
  features: string[][];
  impactScope: FeedbackImpactScope | null;
  status: FeedbackStatus | null;
  keyword: string;
}

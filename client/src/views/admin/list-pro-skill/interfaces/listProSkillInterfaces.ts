export interface Skill {
  id: number;
  name: string;
}

export interface User {
  fullName: string;
}

export interface RawData {
  id: number;
  lastUpdatedTime: string;
  publicDate: string | null;
  publicStatus: number;
  skill: Skill;
  status: number;
  subVersion: number;
  updatedTime: string;
  user: User;
  version: number;
}

export interface TableRow {
  key: string;
  versionId: number;
  template: string;
  version: string;
  status: number;
  isPublic: number;
  updatedBy: string;
  updatedAt: string;
  children?: TableRow[]; // Đệ quy cho cấu trúc lồng nhau
}

export interface SkillRecord {
  key: string;
  template: string;
  version: string;
  status: '承認済み' | '編集中' | '非公開' | '取消' | '差戻';
  isPublic: '公開中' | '非公開' | '-';
  updatedBy: string;
  updatedAt: string;
  children?: SkillRecord[]; // Dùng cho hàng lịch sử (history)
}

export type UpdateListUserType = {
  company: string | number;
  department: string | number;
  division: string | number;
  level: string | number;
  listId: number[];
  listUserSelecteds: UserSelectedType[];
  radioLevelValue: number;
  flagSkillValue: number | string;
};

export type UserSelectedType = {
  id: number;
  level: number;
  fullName: string;
  employeeNumber: string;
  email: string;
  division: { id: number; code: string };
  department: { id: number; code: string; name: string };
  company: { id: number; name: string };
  flagSkill: number;
};

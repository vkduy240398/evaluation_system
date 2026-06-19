export type AdminEvaluationProResType = {
  departmentId: number;
  departmentName: string;
  skillSetters: { fullName: string; id: number }[];
  skillApprovers: { fullName: string; id: number }[];
  isCheckedDep: boolean;
  isCheckedDiv: boolean;
  isCheckedGroup: boolean;
  group: number;
  groups: number[][];
  type?: string;
  typeD: 0 | 1 | 2;
};

export type AdminSettingSkillType = {
  skillId: number;
  skillName: string;
  skillSetters: { fullName: string; id: number }[];
  skillApprovers: { fullName: string; id: number }[];
  skillDepartments: { departmentName: string; departmentId: number; departmentType: 0 | 1 }[];
};

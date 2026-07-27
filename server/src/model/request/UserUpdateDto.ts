export class UserUpdateDto {
  userIdInput: number;
  roles: number[] | null;
  isChangeRoleF2: boolean;
  isChangeRoleF3: boolean;
  isChangeRoleF4: boolean;
  typeChangeRoleF1: number;
  listEvaluatorEvaluationIds: number[];
  periodIdInput: number;
  radioLevelValue: number;
  companyIdInput: number;
  companyNameInput: string;
  departmentIdInput: number;
  departmentNameInput: string;
  divisionIdInput: number;
  divisionNameInput: string;
  levelInput: number | null;
  levelOld: number;
  flagSkillValue: number;
  oldFlagSkill: number;
}

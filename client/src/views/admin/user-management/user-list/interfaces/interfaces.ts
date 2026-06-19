export interface userList {
  company: { id: number; name: string };
  department: { id: number; code: string; name: string };
  division: { id: number; code: string; name: string };
  email: string;
  employeeNumber: string;
  flagSkill: number;
  id: number;
  level: number;
  roles: string[];
  roleConditions: string[];
}

export interface searchProps {
  isLoading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

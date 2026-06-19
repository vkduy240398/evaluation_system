export interface DepartmentProps {
  id: number;
  code?: string;
  name?: string;
  codeName: string;
}
export interface DivisionProps {
  divisionId: number;
  code?: string;
  name?: string;
  codeName: string;
  childrens: DepartmentProps[];
}
export interface CompanyProps {
  id: number;
  name: string;
}
export interface LevelProps {
  id: number;
  level: number;
}

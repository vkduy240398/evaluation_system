import { DepartmentDto } from '../response/DepartmentDto';

export class UserDto {
  id?: number;
  employeeNumber?: string;
  fullName?: string;
  department?: DepartmentDto;
}

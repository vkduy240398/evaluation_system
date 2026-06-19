import { AddUser } from "src/model/getUserDataOracleDto";

export interface ManagementUserRepositoryI {
  addUser(body: AddUser, companyId: number, departmentId: number);
  addDepartment(body: AddUser);
  addCompany(body: AddUser);
}

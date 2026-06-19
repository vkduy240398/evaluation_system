import { AddUser } from "src/model/getUserDataOracleDto";
export interface ManagementUserRepositoryI {
    addUser(body: AddUser, companyId: number, departmentId: number): any;
    addDepartment(body: AddUser): any;
    addCompany(body: AddUser): any;
}

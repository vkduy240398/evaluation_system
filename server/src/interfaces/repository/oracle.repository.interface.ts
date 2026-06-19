import { GetUserDataOracleDto } from 'src/model/getUserDataOracleDto';

export interface OracleRepositoryI {
  getDepartment();
  getUserDataOracleDb(query: GetUserDataOracleDto, companyGroupCode: string);
  getCompany();
}

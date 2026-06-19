import { GetUserDataOracleDto } from 'src/model/getUserDataOracleDto';
export interface OracleRepositoryI {
    getDepartment(): any;
    getUserDataOracleDb(query: GetUserDataOracleDto, companyGroupCode: string): any;
    getCompany(): any;
}

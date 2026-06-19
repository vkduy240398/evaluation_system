import { GetUserDataOracleDto } from 'src/model/getUserDataOracleDto';
export default class OracleService {
    private oracleRepo;
    getUserDataOracleDb(query: GetUserDataOracleDto, companyGroupCode: string): Promise<any>;
    getDepartment(): Promise<any>;
    getCompany(): Promise<any>;
}

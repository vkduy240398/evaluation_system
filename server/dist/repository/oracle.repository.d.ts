import { User } from 'src/entity/User';
import { OracleRepositoryI } from 'src/interfaces/repository/oracle.repository.interface';
import { GetUserDataOracleDto } from 'src/model/getUserDataOracleDto';
export declare class OracleRepository implements OracleRepositoryI {
    private userRepository;
    private oracleDb;
    getUserDataOracleDb(query: GetUserDataOracleDto, companyGroupCode: string): Promise<{
        data: any[];
        total: any;
    }>;
    getDepartment(): Promise<any[]>;
    getCompany(): Promise<any[]>;
    getUserActive(id: number): Promise<User>;
    private countParamOracle;
    private paramGetDataOracle;
}

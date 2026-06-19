import { Inject, Injectable } from '@nestjs/common';
import { GetUserDataOracleDto } from 'src/model/getUserDataOracleDto';
import { OracleRepositoryI } from 'src/interfaces/repository/oracle.repository.interface';
import { OracleRepository } from 'src/repository/oracle.repository';

@Injectable()
export default class OracleService {
  @Inject(OracleRepository)
  private oracleRepo: OracleRepositoryI;
  async getUserDataOracleDb(
    query: GetUserDataOracleDto,
    companyGroupCode: string,
  ) {
    return await this.oracleRepo.getUserDataOracleDb(query, companyGroupCode);
  }
  async getDepartment() {
    const department = await this.oracleRepo.getDepartment();
    return department;
  }
  async getCompany() {
    const department = await this.oracleRepo.getCompany();
    return department;
  }
}

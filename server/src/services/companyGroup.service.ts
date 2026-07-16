import { Inject, Injectable } from '@nestjs/common';
import { CompanyGroupRepo } from 'src/repository/companyGroup.repository';

@Injectable()
export class CompanyGroupService {
  // ** Inject repository
  @Inject(CompanyGroupRepo)
  private companyGroupRepo: CompanyGroupRepo;

  async getAllCompanyGroup() {
    return await this.companyGroupRepo.getAllCompanyGroup();
  }

  async getCompanyByHour(hour: number[]) {
    const sql = `SELECT code, 
                COALESCE(timezone, 'Asia/Tokyo') AS timezone, 
                EXTRACT(HOUR FROM (CURRENT_TIMESTAMP AT TIME ZONE COALESCE(timezone, 'Asia/Tokyo'))) AS hour
          FROM company_group_tbl
          WHERE EXTRACT(HOUR FROM (CURRENT_TIMESTAMP AT TIME ZONE COALESCE(timezone, 'Asia/Tokyo'))) IN (:hour)`;
    const params = {
      hour: hour,
    };

    return await this.companyGroupRepo.getCompanyByRawQuery(sql, params);
  }
}

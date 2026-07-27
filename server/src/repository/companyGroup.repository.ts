import { Inject, Injectable } from '@nestjs/common';
import { QueryTypes } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { CompanyGroup } from 'src/entity/CompanyGroup';
import { CompanyGroupRepoI } from 'src/interfaces/repository/companyGroup.repository.interface';

@Injectable()
export class CompanyGroupRepo implements CompanyGroupRepoI {
  @Inject(EntityConstant.COMPANY_GROUP)
  private companyGroupRepository: typeof CompanyGroup;

  async getAllCompanyGroup(): Promise<CompanyGroup[]> {
    return await this.companyGroupRepository.findAll({
      attributes: ['code', 'timezone', 'emailHR'],
    });
  }

  async getCompanyByRawQuery(sql: string, params: any): Promise<any[]> {
    return await this.companyGroupRepository.sequelize.query(sql, {
      replacements: params,
      type: QueryTypes.SELECT,
      nest: true,
    });
  }

  async getCompanyByCode(code: string): Promise<CompanyGroup> {
    return await this.companyGroupRepository.findOne({
      where: { code } as any,
      attributes: ['code', 'timezone', 'emailHR'],
    });
  }
}

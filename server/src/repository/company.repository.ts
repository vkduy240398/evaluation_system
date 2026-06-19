import { Injectable, Inject } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { Company } from 'src/entity/Company';

@Injectable()
export class CompanyRepository {
  @Inject(EntityConstant.COMPANY)
  private companyRepository: typeof Company;

  async getAllCompany() {
    return await this.companyRepository.findAll({
      attributes: ['id', 'name'],
    });
  }

  async getCompanyById(id: any | undefined) {
    if (id) {
      return await this.companyRepository.findOne({ where: { id } });
    }
    return null;
  }
}

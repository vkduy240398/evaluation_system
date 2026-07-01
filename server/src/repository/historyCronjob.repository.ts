import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { HistoryCronJob } from 'src/entity/HistoryCronJob';

@Injectable()
export class HistoryCronJobRepository {
  @Inject(EntityConstant.HISTORY_CRON_JOB)
  private historyCronJobRepository: typeof HistoryCronJob;

  async add(object: { [x: string]: any }) {
    const checkes = await this.historyCronJobRepository.findOne({
      where: {
        name: object.name,
        companyGroupCode: object.companyGroupCode,
      },
    });

    if (checkes) {
      await checkes.update(object);
      return checkes;
    } else {
      return await this.historyCronJobRepository.findOrCreate({
        where: {
          name: object.name,
          companyGroupCode: object.companyGroupCode,
        },
        defaults: object,
      });
    }
  }

  async getAllByCondition(condition: { [x: string]: any }) {
    return await this.historyCronJobRepository.findAll({ where: condition });
  }

  async deleteHistory(
    condition: { [x: string]: any },
    transaction: Transaction,
  ) {
    return await this.historyCronJobRepository.destroy({
      where: condition,
      transaction: transaction,
    });
  }

  async updateHistory(
    object: { [x: string]: any },
    condition: { [x: string]: any },
  ) {
    return await this.historyCronJobRepository.update(object, {
      where: condition,
    });
  }

  async addNews(object: { [x: string]: any }): Promise<HistoryCronJob> {
    return await this.historyCronJobRepository.create(object, {
      returning: true,
    });
  }

  async findOneByCondition(condition: {
    [x: string]: any;
  }): Promise<HistoryCronJob> {
    return await this.historyCronJobRepository.findOne({ where: condition });
  }
}

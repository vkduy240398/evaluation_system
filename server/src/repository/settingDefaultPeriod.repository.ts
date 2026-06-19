import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { SettingDefaultPeriod } from 'src/entity/SettingDefaultPeriod';
import { RuntimeException } from 'src/model/exception/RuntimeException';

@Injectable()
export class SettingDefaultPeriodRepository {
  @Inject(EntityConstant.SETTING_DEFAULT_PERIOD_VIEWING)
  private settingDefaultPeriodEnity: typeof SettingDefaultPeriod;

  async findOneSettingDefault(companyGroupCode: string | null) {
    return await this.settingDefaultPeriodEnity.findOne({
      where: { companyGroupCode },
    });
  }

  async updateSettingDefaultPeriod(
    defaultPeriod: number,
    companyGroupCode: string,
  ) {
    const data = await this.settingDefaultPeriodEnity
      .findOne({
        where: { companyGroupCode },
      })
      .then((values) => {
        if (values) {
          return values
            .update({
              companyGroupCode: companyGroupCode,
              number: defaultPeriod,
            })
            .then((updateRecord) => {
              return updateRecord;
            });
        } else {
          return this.settingDefaultPeriodEnity
            .create(
              { companyGroupCode: companyGroupCode, number: defaultPeriod },
              {
                logging: true,
              },
            )
            .then((record) => record);
        }
      })
      .catch((error) => {
        throw new RuntimeException(
          error,
          error?.status ||
            error?.statusCode ||
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
    return data;
    // return await this.settingDefaultPeriodEnity.upsert({
    //     id: 1,
    //     number: defaultPeriod,
    //     companyGroupCode: companyGroupCode
    // });
  }
}

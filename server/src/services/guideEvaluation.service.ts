import { Inject, Injectable } from '@nestjs/common';
import { GuideEvaluationRepository } from 'src/repository/guideEvaluation.repository';
import { isFormatDate } from 'src/common/util';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { Op } from 'sequelize';
import { EvaluationRepository } from 'src/repository/evaluation.repository';
import { EvaluationPeriodHelper } from 'src/common/datetime/EvaluationPeriodHelper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');

@Injectable()
export class GuideEvaluationService {
  @Inject(GuideEvaluationRepository)
  private guideEvaluationRepo: GuideEvaluationRepository;

  @Inject(EvaluationRepository)
  private evaluationRepo: EvaluationRepository;

  async getGuideEvaluation(
    level: any,
    flagSkill: number,
    companyGroupCode: string,
  ) {
    return await this.guideEvaluationRepo.getGuideEvaluation(
      level,
      flagSkill,
      companyGroupCode,
    );
  }

  async findListEvaluationCriteriaHistory(
    query: any,
    companyGroupCode?: string,
  ) {
    return await this.guideEvaluationRepo.findListEvaluationCriteriaHistory(
      query,
      companyGroupCode,
    );
  }

  async getInformationCriteria(id: number, companyGroupCode?: string) {
    const arraySteps = await this.guideEvaluationRepo.inforCriteriaStep(
      id,
      companyGroupCode,
    );
    if (!arraySteps) {
      return {
        isShowEdit: null,
        data: null,
        subVersion: 0,
      };
    }

    const criteriaIsEditingList =
      await this.guideEvaluationRepo.getCriteriaVersionIsEditing(
        arraySteps.type,
        companyGroupCode,
      );
    const isShowEdit = criteriaIsEditingList.length === 0;

    const findOneVersion = await this.guideEvaluationRepo.findOne(id);
    const maxVersion = !findOneVersion
      ? 0
      : (await this.guideEvaluationRepo.maxSubVersion({
          version: findOneVersion.version,
          type: findOneVersion.type,
          ...(companyGroupCode !== undefined && { companyGroupCode }),
        })) ?? 0;

    let statusName: string;
    let level: string;
    if (arraySteps.status === 1) {
      statusName = '編集中';
    } else if (arraySteps.status === 2) {
      statusName = '取消';
    } else if (arraySteps.status === 3) {
      statusName = '非公開';
    } else {
      statusName = '公開中';
    }
    if (arraySteps.type === 1 || arraySteps.type === 3) {
      level = '1 ～ 7';
    } else {
      level = '8 ～ 10';
    }
    const results = {
      id: arraySteps.id,
      level: level,
      versionId: arraySteps.id,
      createdTime: isFormatDate(arraySteps.createdTime, 'YYYY/M/D'),
      creationUser: arraySteps.creationUser,
      publicDate: arraySteps.publicDate !== null && arraySteps.publicDate,
      reason: arraySteps.reason,
      status: arraySteps.status,
      subVersion: arraySteps.subVersion,
      type: arraySteps.type,
      updatedTime: isFormatDate(arraySteps.updatedTime, 'YYYY/M/D H:mm'),
      statusName: statusName,
      updatedBy: arraySteps.user?.fullName || '',
      version: arraySteps.version,
      timer: arraySteps.updatedTime,
      contentEvaluationCriteria: arraySteps.contentEvaluationCriteria,
      contentNotes: arraySteps.contentNotes,
      lastUpdatedTime: arraySteps.lastUpdatedTime,
    };
    return {
      isShowEdit: isShowEdit,
      data: results,
      subVersion: maxVersion,
    };
  }

  async publicVersion(params, companyGroupCode: string, timeZone: string) {
    const currentVersion = await this.guideEvaluationRepo.findOne(
      params.versionId,
      companyGroupCode,
    );

    if (
      new Date(currentVersion.updatedTime).getTime() ===
      new Date(params.timer).getTime()
    ) {
      await this.guideEvaluationRepo.updateAllVersionToPrivate(
        {
          type: currentVersion.type,
        },
        companyGroupCode,
      );
      if (currentVersion.subVersion !== 0) {
        const newVersion = await this.guideEvaluationRepo.maxVersion(
          {
            type: params.type,
            ...(companyGroupCode !== undefined && { companyGroupCode }),
          },
          'version',
        );

        const objects = {
          version: (newVersion as number) + 1,
          subVersion: 0,
          publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
          lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
          status: 4,
        };

        // Khi public tiêu chí mới thì Update guideVersionId của evaluation
        await this.updateGuideEvaluation(
          params.type,
          params.versionId,
          companyGroupCode,
          timeZone,
        );

        return await this.guideEvaluationRepo.updateVersion(
          params.versionId,
          objects,
          companyGroupCode,
        );
      } else {
        const objects = {
          version: params.version,
          subVersion: params.subVersion,
          publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
          lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
          status: 4,
        };

        // Khi public tiêu chí mới thì Update guideVersionId của evaluation
        await this.updateGuideEvaluation(
          params.type,
          params.versionId,
          companyGroupCode,
          timeZone,
        );

        return await this.guideEvaluationRepo.updateVersion(
          params.versionId,
          objects,
          companyGroupCode,
        );
      }
    } else {
      throw new RuntimeException('Date invalid', 409);
    }
  }

  async saveDraftData(
    body: any,
    userId: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const currentVersion = await this.guideEvaluationRepo.findOne(
      body.id,
      companyGroupCode,
    );
    const editAlreadys = await this.guideEvaluationRepo.findAllByCondition({
      [Op.and]: [
        { type: currentVersion.type },
        {
          status: 1,
        },
        {
          id: { [Op.notIn]: [currentVersion.id] },
        },
        companyGroupCode === undefined ? {} : { companyGroupCode },
      ],
    });

    if (editAlreadys.length > 0) {
      return {
        id: body.id,
        timer: body.updated,
        subVersion: body.subVersion,
        version: body.version,
        status: body.status,
        lastUpdatedTime: body.updated,
        code: 406,
      };
    }
    if (![1, 4].includes(currentVersion.status)) {
      return {
        id: body.id,
        timer: body.updated,
        subVersion: body.subVersion,
        version: body.version,
        status: body.status,
        lastUpdatedTime: body.updated,
        edited: true,
        code: 407,
      };
    }

    if (
      new Date(currentVersion.updatedTime).getTime() ===
      new Date(body.updated).getTime()
    ) {
      if (body.status === 3 || body.status === 4) {
        const objectNewVersion = {
          type: body.type,
          version: body.version,
          subVersion: body.subVersion + 1,
          creationUser: userId,
          status: 1,
          reason: body.reason,
          contentEvaluationCriteria: body.contentEvaluationCriteria,
          contentNotes: body.contentNotes,
          lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
          companyGroupCode,
        };
        await this.guideEvaluationRepo.updateVersion(
          body.id,
          {
            type: body.type,
          },
          companyGroupCode,
        );
        const versionId = await this.guideEvaluationRepo.createNewVersion(
          objectNewVersion,
        );
        return {
          id: versionId.id,
          updatedTime: versionId.updatedTime,
          subVersion: versionId.subVersion,
          version: versionId.version,
          lastUpdatedTime: versionId.lastUpdatedTime,
          code: 200,
        };
      } else if (body.status === 1) {
        const results = await this.guideEvaluationRepo.updateVersion(
          body.id,
          {
            type: body.type,
            creationUser: userId,
            reason: body.reason,
            contentEvaluationCriteria: body.contentEvaluationCriteria,
            contentNotes: body.contentNotes,
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              timeZone,
            ),
          },
          companyGroupCode,
        );

        return {
          id: results[1][0].id,
          updatedTime: results[1][0].updatedTime,
          subVersion: results[1][0].subVersion,
          version: results[1][0].version,
          lastUpdatedTime: results[1][0].lastUpdatedTime,
          code: 200,
        };
      }
    } else {
      throw new RuntimeException('Date invalid', 409);
    }
  }

  async cancelVersionPro(
    versionId: number,
    userId: number,
    body: any,
    companyGroupCode?: string,
  ) {
    const version = await this.guideEvaluationRepo.findOne(
      versionId,
      companyGroupCode,
    );
    const lastUpdatedTime = isFormatDate(new Date(), 'YYYY/M/D H:mm');
    if (
      version.status === 1 &&
      new Date(version.updatedTime).getTime() === new Date(body.timer).getTime()
    ) {
      return await this.guideEvaluationRepo.cancelVersionProSkill(
        versionId,
        userId,
        lastUpdatedTime,
        companyGroupCode,
      );
    }
    throw new RuntimeException('No status valid or Date', 409);
  }

  async savePrivateVersion(params: any) {
    const currentVersion = await this.guideEvaluationRepo.findOne(
      params.versionId,
    );

    if (
      new Date(currentVersion.updatedTime).getTime() ===
      new Date(params.timer).getTime()
    ) {
      if (params.status !== 1 && params.status !== 2) {
        const subVersionByMax = await this.guideEvaluationRepo.maxSubVersion({
          version: currentVersion.version,
          type: currentVersion.type,
          companyGroupCode: params.companyGroupCode,
        });
        await this.guideEvaluationRepo.updateVersion(params.versionId, {
          type: params.type,
        });
        const objectNewVersion = {
          subVersion: (subVersionByMax as number) + 1,
          version: currentVersion.version,
          status: 3,
          creationUser: params.userId,
          type: params.type,
          reason: params.reason,
          contentEvaluationCriteria: params.contentEvaluationCriteria,
          contentNotes: params.contentNotes,
          lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
          companyGroupCode: params.companyGroupCode,
        };
        const versionNew = await this.guideEvaluationRepo.createNewVersion(
          objectNewVersion,
        );

        return {
          id: versionNew.id,
          status: 3,
          type: params.type,
        };
      } else {
        await this.guideEvaluationRepo.updateVersion(params.versionId, {
          type: params.type,
          status: 3,
          contentEvaluationCriteria: params.contentEvaluationCriteria,
          contentNotes: params.contentNotes,
          creationUser: params.userId,
          reason: params.reason,
          lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm'),
        });

        return {
          id: params.versionId,
          status: 3,
          type: params.type,
          contentEvaluationCriteria: params.contentEvaluationCriteria,
          contentNotes: params.contentNotes,
          creationUser: params.userId,
          reason: params.reason,
        };
      }
    } else {
      throw new RuntimeException('Date invalid', 409);
    }
  }

  async savePublicVersion(
    params: any,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const currentVersion = await this.guideEvaluationRepo.findOne(
      params.versionId,
      companyGroupCode,
    );

    if (![1, 4].includes(currentVersion.status)) {
      return {
        code: 407,
        id: params.versionId,
        status: currentVersion.status,
        type: params.type,
      };
    }

    if (
      new Date(currentVersion.updatedTime).getTime() ===
      new Date(params.timer).getTime()
    ) {
      const newVersion =
        (await this.guideEvaluationRepo.maxVersion(
          {
            type: params.type,
            ...(companyGroupCode !== undefined && { companyGroupCode }),
          },
          'version',
        )) ?? 0;

      if (params.status !== 1 && params.status !== 2) {
        await this.guideEvaluationRepo.updateAllVersionToPrivate(
          {
            type: currentVersion.type,
          },
          companyGroupCode,
        );

        await this.guideEvaluationRepo.updateVersion(
          params.versionId,
          {
            type: params.type,
          },
          companyGroupCode,
        );
        const objectNewVersion = {
          subVersion: 0,
          version: (newVersion as number) + 1,
          status: 4,
          creationUser: params.userId,
          type: params.type,
          reason: params.reason,
          contentEvaluationCriteria: params.contentEvaluationCriteria,
          contentNotes: params.contentNotes,
          publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
          lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
          companyGroupCode,
        };
        const versionNew = await this.guideEvaluationRepo.createNewVersion(
          objectNewVersion,
        );

        // Khi public tiêu chí mới thì Update guideVersionId của evaluation
        await this.updateGuideEvaluation(
          params.type,
          versionNew.id,
          companyGroupCode,
          timeZone,
        );

        return {
          id: versionNew.id,
          status: 4,
          type: params.type,
        };
      } else {
        await this.guideEvaluationRepo.updateAllVersionToPrivate(
          {
            type: currentVersion.type,
          },
          companyGroupCode,
        );

        await this.guideEvaluationRepo.updateVersion(
          params.versionId,
          {
            type: params.type,
            status: 4,
            subVersion: 0,
            version: (newVersion as number) + 1,
            creationUser: params.userId,
            contentEvaluationCriteria: params.contentEvaluationCriteria,
            contentNotes: params.contentNotes,
            reason: params.reason,
            publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              timeZone,
            ),
          },
          companyGroupCode,
        );

        // Khi public tiêu chí mới thì Update guideVersionId của evaluation
        await this.updateGuideEvaluation(
          params.type,
          params.versionId,
          companyGroupCode,
          timeZone,
        );

        return {
          id: params.versionId,
          status: 4,
          type: params.type,
          contentEvaluationCriteria: params.contentEvaluationCriteria,
          contentNotes: params.contentNotes,
          creationUser: params.userId,
          reason: params.reason,
        };
      }
    } else {
      throw new RuntimeException('Date invalid', 409);
    }
  }

  async updateGuideEvaluation(
    type: number,
    versionId: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const periodTitle = `${EvaluationPeriodHelper.getCurrentPeriodYear(
      timeZone,
    )}年${EvaluationPeriodHelper.getCurrentPeriodIndex(timeZone)}`;
    await this.evaluationRepo.updateEvaluationWithoutTransaction(
      { guideVersionId: versionId },
      {
        [Op.and]: [
          {
            level: type === 1 || type === 3 ? { [Op.lte]: 7 } : { [Op.gt]: 7 },
          },
          type === 2 ? {} : { flagSkill: type === 1 ? 1 : 0 },
          { title: periodTitle },
          companyGroupCode === undefined ? {} : { companyGroupCode },
        ],
      },
    );
  }
}

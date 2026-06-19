import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import EntityConstant from 'src/constant/EntityConstant';
import { User } from 'src/entity/User';
import { VersionGuideEvaluation } from 'src/entity/VersionGuideEvaluation';
import { VersionSettingType } from '../enum/VersionSettingType';

@Injectable()
export class GuideEvaluationRepository {
  @Inject(EntityConstant.VERSION_GUIDE_EVALUATION)
  private guideEvaluationRepository: typeof VersionGuideEvaluation;

  async getGuideEvaluation(
    level: any,
    flagSkill: number,
    companyGroupCode: string,
  ) {
    return await this.guideEvaluationRepository.findOne({
      attributes: ['contentEvaluationCriteria', 'contentNotes', 'type'],
      where: {
        [Op.and]: [
          {
            type:
              level < 8 ? (flagSkill === 1 ? 1 : 3) : flagSkill === 1 ? 2 : 4,
          },
          { status: 4 },
          { companyGroupCode: companyGroupCode },
        ],
      },
    });
  }

  async findListEvaluationCriteriaHistory(
    query: any,
    companyGroupCode?: string,
  ) {
    let status = query?.status;
    const type = query?.type;
    const limit = query?.limit;
    const offset = query?.offset;
    const flagSkill = query?.flagSkill;
    let tempType: number;

    if (status === 'すべて') status = undefined;
    if (type === '1') {
      if (flagSkill === '1') {
        tempType = VersionSettingType.LEVEL_1_7;
      } else if (flagSkill === '3') {
        tempType = VersionSettingType.LEVEL_1_7_NS;
      }
    } else if (type === '2') {
      if (flagSkill === '1') {
        tempType = VersionSettingType.LEVEL_8_10;
      } else if (flagSkill === '3') {
        tempType = VersionSettingType.LEVEL_8_10_NS;
      }
    }

    const datas = await this.guideEvaluationRepository.findAndCountAll({
      where: {
        type: tempType,
        ...(status !== undefined && { status }),
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      attributes: {
        exclude: ['contentEvaluationCriteria', 'contentNotes'],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'employeeNumber', 'fullName'],
        },
      ],
      order: [
        ['version', 'DESC'],
        ['subVersion', 'DESC'],
      ],
      distinct: true,
      offset: offset,
      limit: limit,
    });

    return { data: datas.rows, counts: datas.count };
  }

  async inforCriteria(id: number) {
    return await this.guideEvaluationRepository.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullName'],
        },
      ],
    });
  }

  async inforCriteriaStep(
    id: number,
    companyGroupCode?: string,
  ): Promise<VersionGuideEvaluation> {
    return await this.guideEvaluationRepository.findOne({
      where: {
        id: id,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['fullName'],
        },
      ],
    });
  }

  async findOne(
    versionId: number,
    companyGroupCode?: string,
  ): Promise<VersionGuideEvaluation> {
    return await this.guideEvaluationRepository.findOne({
      where: {
        id: versionId,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
    });
  }

  async maxSubVersion(object: { [x: string]: any }) {
    const max = await this.guideEvaluationRepository.max('subVersion', {
      where: object,
    });
    return max;
  }

  async updateAllVersionToPrivate(
    object: { [x: string]: any },
    companyGroupCode?: string,
  ) {
    return await this.guideEvaluationRepository.update(
      {
        status: 3,
        publicDate: null,
      },
      {
        where: {
          type: object.type,
          status: { [Op.notIn]: [2] },
          ...(companyGroupCode !== undefined && { companyGroupCode }),
        },
      },
    );
  }

  async maxVersion(where: any, fields: string) {
    const max = await this.guideEvaluationRepository.max(fields, {
      where: where,
    });
    return max;
  }

  async updateVersion(versionId: any, object: any, companyGroupCode?: string) {
    return await this.guideEvaluationRepository.update(object, {
      where: {
        id: versionId,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
      returning: true,
    });
  }

  async createNewVersion(object: any) {
    const results = await this.guideEvaluationRepository.create(object);
    return results;
  }

  async cancelVersionProSkill(
    versionId: number,
    _userId: number,
    _lastUpdatedTime: any,
    companyGroupCode?: string,
  ) {
    return await this.guideEvaluationRepository.update(
      {
        status: 2,
        // creationUser: userId,
        // lastUpdatedTime: lastUpdatedTime
      },
      {
        where: {
          id: versionId,
          ...(companyGroupCode !== undefined && { companyGroupCode }),
        },
      },
    );
  }

  async findOneGuide(where: {
    [x: string]: any;
  }): Promise<VersionGuideEvaluation> {
    return await this.guideEvaluationRepository.findOne({
      where: where,
    });
  }

  async getGuideEvaluationPublic(companyGroupCode: string) {
    return await this.guideEvaluationRepository.findAll({
      attributes: ['id', 'type'],
      where: { status: 4, companyGroupCode: companyGroupCode },
    });
  }

  async getCriteriaVersionIsEditing(type: any, companyGroupCode?: string) {
    const datas = await this.guideEvaluationRepository.findAll({
      where: {
        type: type,
        status: 1,
        ...(companyGroupCode !== undefined && { companyGroupCode }),
      },
    });

    return datas;
  }

  async findAllByCondition(object: {
    [x: string]: any;
  }): Promise<VersionGuideEvaluation[]> {
    return await this.guideEvaluationRepository.findAll({
      attributes: ['publicDate', 'type', 'id', 'status'],
      where: object,
      limit: 1,
    });
  }
}

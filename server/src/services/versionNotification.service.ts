/* eslint-disable @typescript-eslint/naming-convention */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { CreationUserDto } from 'src/model/generic/CreationUserDto';
import { VersionNotificationRepositoryI } from 'src/interfaces/repository/versionNotification.repository.interface';
import { VersionNotificationRepository } from 'src/repository/versionNotification.repository';
import { ListVersionNotificationParam } from 'src/model/request/F6/ListVersionNotificationParam';
import { VersionNotificationServiceI } from 'src/interfaces/service/versionNotification.service.interface';
import { VersionNotificationDto } from 'src/model/generic/VersionNotificationDto';
import { ListVersionNotificationResponse } from 'src/model/response/F6/ListVersionNotificationResponse';
import { Request } from 'express';
import { isFormatDate } from 'src/common/util';
import { VersionNotificationStatus } from 'src/enum/VersionNotificationStatus';
import { CancelVersionNotificationDto } from 'src/model/request/F6/CancelVersionNotificationDto';
import { EvaluationPeriodRepository } from 'src/repository/evaluationPeriod.repository';
import { ErrorMessageResponseDto } from 'src/model/response/ErrorMessageResponseDto';
import { PublicVersionNotificationDto } from 'src/model/request/F6/PublicVersionSettingDto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require('moment-timezone');
const NEW_CREATE_TYPE = 'new';
const STATUS_CODE_CONFLICT = 1409;

@Injectable()
export class VersionNotificationService implements VersionNotificationServiceI {
  @Inject(VersionNotificationRepository)
  private versionNotificationRepository: VersionNotificationRepositoryI;

  @Inject(EvaluationPeriodRepository)
  private evaluationPeriodRepository: EvaluationPeriodRepository;

  /**
   * Get list version notification
   *
   * @author tran.le.ha.nam
   */
  async getListVersionNotification(
    param: ListVersionNotificationParam,
    companyGroupCode?: string,
  ) {
    const result = new ListVersionNotificationResponse();

    try {
      const listEvaluationCalculationHistories =
        await this.versionNotificationRepository.getListVersionPaging(
          param,
          companyGroupCode,
        );

      const total =
        await this.versionNotificationRepository.countListVersionNotification(
          param,
          companyGroupCode,
        );

      let records: VersionNotificationDto[] = [];
      result.counts = total;

      if (listEvaluationCalculationHistories.length > 0) {
        records = listEvaluationCalculationHistories.map((el) => {
          const versionNotificationDto = new VersionNotificationDto();
          versionNotificationDto.id = el.id;
          versionNotificationDto.version = el.version;
          versionNotificationDto.subVersion = el.subVersion;
          versionNotificationDto.versionDisplay =
            el.version + '.' + el.subVersion;
          versionNotificationDto.status = el.status;
          versionNotificationDto.reason = el.reason;
          versionNotificationDto.publicDate = el.publicDate;
          const creationUserDto = new CreationUserDto();
          creationUserDto.id = el.user?.id;
          creationUserDto.fullName = el.user?.fullName;
          versionNotificationDto.user = creationUserDto;
          versionNotificationDto.creationUser = el.creationUser;
          versionNotificationDto.updatedTime = el.updatedTime;
          versionNotificationDto.lastUpdatedTime = el.lastUpdatedTime;
          return versionNotificationDto;
        });
      }

      result.rows = records;
    } catch (err) {
      throw new RuntimeException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return result;
  }

  /**
   * Get detail notification
   *
   * @author tran.le.ha.nam
   */
  async getDetailNotification(versionId: number, companyGroupCode?: string) {
    const versionNotification =
      await this.versionNotificationRepository.getVersionNotificationById(
        versionId,
        companyGroupCode,
      );

    if (!versionNotification) {
      throw new RuntimeException('Version not found', HttpStatus.NOT_FOUND);
    }

    const result = new VersionNotificationDto();
    result.id = versionNotification.id;
    result.version = versionNotification.version;
    result.subVersion = versionNotification.subVersion;
    result.versionDisplay =
      versionNotification.version + '.' + versionNotification.subVersion;
    result.status = versionNotification.status;
    result.reason = versionNotification.reason;
    const creationUserDto = new CreationUserDto();
    creationUserDto.id = versionNotification.user.id;
    creationUserDto.fullName = versionNotification.user.fullName;
    result.user = creationUserDto;
    result.creationUser = versionNotification.creationUser;
    result.content = versionNotification.content;
    result.publicDate = versionNotification.publicDate;
    result.updatedTime = versionNotification.updatedTime;
    result.lastUpdatedTime = versionNotification.lastUpdatedTime;

    const existEditingVersion =
      await this.versionNotificationRepository.existEditingVersion(
        versionId,
        companyGroupCode,
      );
    result.existEditingVersion = existEditingVersion;

    return result;
  }

  async saveDraftVersionNotification(
    versionNotificationDto: VersionNotificationDto,
    type: string,
    req: Request,
  ) {
    const isMainVersionPublic =
      await this.versionNotificationRepository.isMainVersionPublic(
        versionNotificationDto.version,
        req.user.companyGroupCode,
      );

    if (!isMainVersionPublic) {
      return new ErrorMessageResponseDto(
        STATUS_CODE_CONFLICT,
        '編集ベースとなるバージョンが非公開になったため保存できません。',
        Date.now(),
      );
    }

    const existEditingVersion =
      await this.versionNotificationRepository.existEditingVersion(
        type !== NEW_CREATE_TYPE ? versionNotificationDto.id : null,
        req.user.companyGroupCode,
      );

    if (existEditingVersion) {
      return new ErrorMessageResponseDto(
        STATUS_CODE_CONFLICT,
        '編集中のバージョンが存在しているため新規作成できません。',
        Date.now(),
      );
    }

    let result = new VersionNotificationDto();

    versionNotificationDto.creationUser = req.user.id;
    versionNotificationDto.user = req.user;
    versionNotificationDto.lastUpdatedTime = isFormatDate(
      new Date(),
      'YYYY/M/D H:mm',
      req.user.timeZone,
    );

    try {
      if (type === NEW_CREATE_TYPE) {
        const maxSubVersion = (
          await this.versionNotificationRepository.findMaxSubVersion(
            versionNotificationDto.version,
            req.user.companyGroupCode,
          )
        ).subVersion;
        versionNotificationDto.subVersion = maxSubVersion + 1;
        versionNotificationDto.status = VersionNotificationStatus.EDITING;
        versionNotificationDto.id = null;
        versionNotificationDto.publicDate = null;
        versionNotificationDto['companyGroupCode'] = req.user.companyGroupCode;

        const newVersion =
          await this.versionNotificationRepository.createVersionNotification(
            versionNotificationDto,
          );

        versionNotificationDto.id = newVersion.id;
      } else {
        const versionNotification =
          await this.versionNotificationRepository.getVersionNotificationById(
            versionNotificationDto.id,
            req.user.companyGroupCode,
          );

        if (
          versionNotificationDto.updatedTime &&
          versionNotificationDto.updatedTime.toString() !==
            versionNotification.updatedTime.toISOString()
        ) {
          throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
        }

        await this.versionNotificationRepository.updateVersionNotification(
          versionNotificationDto,
          req.user.companyGroupCode,
        );
      }

      const updatedVersionSetting =
        await this.versionNotificationRepository.getVersionUpdatedTime(
          versionNotificationDto.id,
        );

      versionNotificationDto.updatedTime = updatedVersionSetting.updatedTime;
      result = versionNotificationDto;
    } catch (error) {
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  async cancelVersionNotification(
    data: CancelVersionNotificationDto,
    companyGroupCode?: string,
  ) {
    const version =
      await this.versionNotificationRepository.findUpdateTimeVersion(
        data.id,
        companyGroupCode,
      );

    if (
      data.updatedTime &&
      version.updatedTime.toISOString() !== data.updatedTime.toString()
    ) {
      throw new RuntimeException('Date invalid', HttpStatus.CONFLICT);
    }

    delete data.updatedTime;
    await this.versionNotificationRepository.updateVersionNotification(
      data,
      companyGroupCode,
    );

    const result =
      await this.versionNotificationRepository.findUpdateTimeVersion(data.id);

    return result;
  }

  async savePublicVersionNotification(
    versionNotificationDto: VersionNotificationDto,
    req: Request,
  ) {
    const versionNotification =
      await this.versionNotificationRepository.getVersionNotificationById(
        versionNotificationDto.id,
        req.user.companyGroupCode,
      );

    const isMainVersionPublic =
      await this.versionNotificationRepository.isMainVersionPublic(
        versionNotificationDto.version,
        req.user.companyGroupCode,
      );

    if (!isMainVersionPublic) {
      return new ErrorMessageResponseDto(
        STATUS_CODE_CONFLICT,
        '編集ベースとなるバージョンが非公開になったため保存できません。',
        Date.now(),
      );
    }

    const transaction =
      await this.versionNotificationRepository.getNewTransaction();
    versionNotificationDto.creationUser = req.user.id;
    versionNotificationDto.lastUpdatedTime = isFormatDate(
      new Date(),
      'YYYY/M/D H:mm',
      req.user.timeZone,
    );
    const httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

    try {
      const maxVersion = (
        await this.versionNotificationRepository.findMaxVersion(
          req.user.companyGroupCode,
        )
      ).version;
      versionNotificationDto.version = maxVersion + 1;
      versionNotificationDto.subVersion = 0;
      versionNotificationDto.publicDate = isFormatDate(
        new Date(),
        'YYYY/M/D H:mm',
        req.user.timeZone,
      );

      if (
        versionNotificationDto.status === VersionNotificationStatus.PUBLISHED
      ) {
        versionNotificationDto.id = null;
        versionNotificationDto['companyGroupCode'] = req.user.companyGroupCode;

        const newVersion =
          await this.versionNotificationRepository.createVersionNotification(
            versionNotificationDto,
            transaction,
          );
        versionNotificationDto.id = newVersion.id;
      } else {
        if (
          versionNotificationDto.updatedTime &&
          versionNotificationDto.updatedTime.toString() !==
            versionNotification.updatedTime.toISOString()
        ) {
          throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
        }

        versionNotificationDto.status = VersionNotificationStatus.PUBLISHED;

        await this.versionNotificationRepository.updateVersionNotification(
          versionNotificationDto,
          req.user.companyGroupCode,
          transaction,
        );
      }

      await this.versionNotificationRepository.unPublicVersionSetting(
        versionNotificationDto.id,
        transaction,
        req.user.companyGroupCode,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || httpCode,
      );
    }

    return versionNotificationDto;
  }

  async findMaxSubVersion(version: number, companyGroupCode?: string) {
    return (
      await this.versionNotificationRepository.findMaxSubVersion(
        version,
        companyGroupCode,
      )
    ).subVersion;
  }

  async getPublicNotification(companyGroupCode?: string) {
    const versionNotification =
      await this.versionNotificationRepository.getPublicVersionNotification(
        companyGroupCode,
      );
    const result = new VersionNotificationDto();
    result.id = versionNotification.id;
    result.status = versionNotification.status;
    result.content = versionNotification.content;
    result.publicDate = versionNotification.publicDate;

    return result;
  }

  async publicVersionNotification(
    publicVersionNotificationDto: PublicVersionNotificationDto,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const versionNotification =
      await this.versionNotificationRepository.findVersionById(
        publicVersionNotificationDto.versionId,
      );

    if (
      !versionNotification ||
      (companyGroupCode !== undefined &&
        versionNotification.companyGroupCode !== companyGroupCode)
    ) {
      throw new RuntimeException('Version not found', HttpStatus.NOT_FOUND);
    }

    if (
      publicVersionNotificationDto.updatedTime &&
      publicVersionNotificationDto.updatedTime !==
        versionNotification.updatedTime.toISOString()
    ) {
      throw new RuntimeException('Update conflict', HttpStatus.CONFLICT);
    }

    const maxVersion = (
      await this.versionNotificationRepository.findMaxVersion(companyGroupCode)
    ).version;

    const data = {
      status: publicVersionNotificationDto.status,
      version: publicVersionNotificationDto.version
        ? publicVersionNotificationDto.version
        : maxVersion + 1,
      subVersion: 0,
      publicDate: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
      lastUpdatedTime: isFormatDate(new Date(), 'YYYY/M/D H:mm', timeZone),
    };

    await this.versionNotificationRepository.publicVersionSetting(
      publicVersionNotificationDto.versionId,
      data,
      companyGroupCode,
    );

    return publicVersionNotificationDto;
  }
}

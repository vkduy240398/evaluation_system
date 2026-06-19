import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { isFormatDate } from 'src/common/util';
import { TypeAchievement } from 'src/enum/TypeAchievement';
import { VersionProskillPublicStatus } from 'src/enum/VersionProskillPublicStatus';
import { VersionProskillStatus } from 'src/enum/VersionProskillStatus';
import { AdminEvaluationRepositoryI } from 'src/interfaces/repository/adminEvaluation.repository';
import { VersionSettingRepositoryI } from 'src/interfaces/repository/versionSetting.repository.interface';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import {
  ListProSKillVersionRequestDto,
  ProSKillVersionRequestDto,
} from 'src/model/request/ProSkillSetingRequestDto';
import { VersionProSkillDto } from 'src/model/response/VersionProSkillDto';
import { AdminEvaluationRepository } from 'src/repository/adminEvaluation.repository';
import { DepartmentRepository } from 'src/repository/department.repository';
import { ProSkillSettingRepository } from 'src/repository/proSkillSetting.repository';
import { VersionSettingRepository } from 'src/repository/versionSetting.repository';
import { Request } from 'express';

@Injectable()
export class ProSkillSettingServices {
  @Inject(ProSkillSettingRepository)
  private proSkillSettingRepository: ProSkillSettingRepository;

  @Inject(AdminEvaluationRepository)
  private adminEvaluation: AdminEvaluationRepositoryI;

  @Inject(VersionSettingRepository)
  private versionSettingRepository: VersionSettingRepositoryI;

  @Inject(DepartmentRepository)
  private departmentRepository: DepartmentRepository;

  async getSkillRoleUser(userId: number, companyGroupCode: string) {
    const skill = await this.proSkillSettingRepository.getSkillRoleUser(
      userId,
      companyGroupCode,
    );
    return {
      skill,
    };
  }

  async getVersionProSkill(
    query: ListProSKillVersionRequestDto,
    userId: number,
    companyGroupCode: string,
  ) {
    const { status, skillId, offset, limit, publicStatus, type } = query;

    const skills = await this.adminEvaluation
      .getAllSkillByCondition(userId)
      .then((data) => {
        return data.map((v: any) => {
          return v.skillId;
        });
      });
    if (type === '1') {
      const verSionProSkills =
        await this.proSkillSettingRepository.getVersionProSkill(
          companyGroupCode,
          status,
          offset,
          limit,
          publicStatus,
          [skillId].filter((v: any) => v !== '-1' && v !== undefined).length > 0
            ? [skillId]
            : skills,
          type,
        );

      return {
        ...verSionProSkills,
      };
    } else {
      const { skillId, offset, limit } = query;
      const datas = await this.proSkillSettingRepository.listProSkillF3New(
        companyGroupCode,
        skillId,
        offset,
        limit,
        userId,
      );
      return datas;
    }
  }

  /**
   * You can add comment decription for this function here
   *
   * @author tran.le.ha.nam
   */
  async getDetailProSkillGeneric(versionId: number, companyGroupCode?: string) {
    const versionProSkill =
      await this.proSkillSettingRepository.getDetailProSkillGeneric(
        versionId,
        companyGroupCode,
      );

    if (!versionProSkill) {
      throw new RuntimeException('Version not found', HttpStatus.NOT_FOUND);
    }

    const listProSkills =
      await this.proSkillSettingRepository.getListProSkillByVersionId(
        versionId,
      );

    const settersAndApprovers = versionProSkill.skill.skillRoles.reduce(
      (acc: { setters: string[]; approvers: string[] }, current) => {
        if (current.role == 1) {
          acc['setters'].push(current.user.fullName);
        } else if (current.role == 2) {
          acc['approvers'].push(current.user.fullName);
        }

        return acc;
      },
      { setters: [], approvers: [] },
    );

    const versionProSkillDto = new VersionProSkillDto();
    versionProSkillDto.id = versionProSkill.id;
    versionProSkillDto.skill = versionProSkill.skill?.name;
    versionProSkillDto.userUpdated = versionProSkill.user?.fullName;
    versionProSkillDto.updatedTime = versionProSkill.updatedTime;
    versionProSkillDto.publicStatus = versionProSkill.publicStatus;
    versionProSkillDto.status = versionProSkill.status;
    versionProSkillDto.version = `${versionProSkill.version}.${versionProSkill.subVersion}`;
    versionProSkillDto.publicDate = versionProSkill.publicDate;
    versionProSkillDto.reason = versionProSkill.reason;
    versionProSkillDto.versionMain = versionProSkill.version;
    versionProSkillDto.versionSub = versionProSkill.subVersion;
    versionProSkillDto.lastUpdatedTime = versionProSkill.lastUpdatedTime;
    versionProSkillDto.children = listProSkills;
    versionProSkillDto.settersAndApprovers = settersAndApprovers;

    return versionProSkillDto;
  }

  async getVersionProSkillDepartment(
    query: ProSKillVersionRequestDto,
    companyGroupCode?: string,
  ) {
    const { skillId, offset, limit } = query;
    const verSionProSkills =
      await this.proSkillSettingRepository.getVersionProSkillDepartment(
        skillId,
        offset,
        limit,
        companyGroupCode,
      );
    return verSionProSkills;
  }

  async createNewVersionSaveDraft(
    versionId: number,
    objectUpdated: any,
    creationUser: number,
    companyGroupCode: string,
    timeZone: string,
  ): Promise<any> {
    const version = await this.proSkillSettingRepository.findOneVersion({
      id: versionId,
    });
    // let departmentNames = '';
    // if (version.department.type === DepartmentType.GROUP) {
    //   const getAllDepartmentByGroupOrDivisions =
    //     await this.divisionSubClassRepository
    //       .getDepartmentIdByCondition({
    //         divisionId: version.department.id,
    //       })
    //       .then((response) => {
    //         return response.map((v) => {
    //           return `${v.department.code}: ${v.department.name}`;
    //         });
    //       });

    //   departmentNames = getAllDepartmentByGroupOrDivisions.join('、');
    // }
    const rolesChecked = await this.proSkillSettingRepository.getRoleUser(
      version.skillId,
      creationUser,
    );

    if (rolesChecked) {
      if (
        new Date(objectUpdated.updated).getTime() ===
        version.updatedTime.getTime()
      ) {
        const editAlreadys =
          await this.proSkillSettingRepository.findAllVersionWaiting({
            [Op.and]: [
              {
                skillId: version.skillId,
              },
              {
                id: { [Op.notIn]: [versionId] },
              },
              {
                // status 1 , 3 , 5 and public status = 2
                [Op.or]: [
                  { status: VersionProskillStatus.EDITING },
                  { status: VersionProskillStatus.PENDING_APPROVAL },
                  { status: VersionProskillStatus.REJECTED },
                  { publicStatus: VersionProskillPublicStatus.PENDING },
                ],
              },
              {
                companyGroupCode: companyGroupCode,
              },
            ],
          });

        if (editAlreadys > 0) {
          return {
            code: 406,
          };
        }
        if ([3, 4].includes(version.status)) {
          const transactionVersionProSkill =
            await this.proSkillSettingRepository.getTransactionVersionProSkill();
          try {
            await this.proSkillSettingRepository.updatedVersion(
              versionId,
              {
                status: version.status,
              },
              transactionVersionProSkill,
            );
            const findMax = await this.proSkillSettingRepository.findMax(
              version.version,
              version.skillId,
              companyGroupCode,
            );

            const dataCreate = {
              version: version.version,
              updatedTime: new Date(),
              subVersion: Math.round(findMax + 1),
              status: 1,
              skillId: version.skillId,
              reason: objectUpdated.reason,
              publicStatus: 0,
              creationUser: creationUser,
              lastUpdatedTime: isFormatDate(
                new Date(),
                'YYYY/M/D H:mm',
                timeZone,
              ),
              // type: version.department.type,
              companyGroupCode: companyGroupCode,
            };

            const newVersion =
              await this.proSkillSettingRepository.createNewVersionSaveDraft(
                dataCreate,
                transactionVersionProSkill,
              );
            await transactionVersionProSkill.commit();

            return {
              code: 200,
              id: newVersion.id,
              updatedTime: newVersion.updatedTime,
              status: newVersion.status,
              publicStatus: newVersion.publicStatus,
              skillId: version.skillId,
              version: newVersion.version,
              subVersion: newVersion.subVersion,
              reason: newVersion.reason,
              skillActive: version.skill.active,
              skill: version.skill.name,
              skillName: version.skill.name,
              lastUpdatedTime: newVersion.lastUpdatedTime,
              // listDepartment: departmentNames,
            };
          } catch (error) {
            await transactionVersionProSkill.rollback();
          }
          // await this.proSkillSettingRepository.deleteListProSkill(versionId);
        } else {
          const transactionVersionProSkill =
            await this.proSkillSettingRepository.getTransactionVersionProSkill();

          try {
            const results = await this.proSkillSettingRepository.updatedVersion(
              versionId,
              {
                status: version.status === 5 ? 5 : 1,
                reason: objectUpdated.reason,
                creationUser: creationUser,
                lastUpdatedTime: isFormatDate(
                  new Date(),
                  'YYYY/M/D H:mm',
                  timeZone,
                ),
                companyGroupCode: companyGroupCode,
              },
              transactionVersionProSkill,
            );

            await this.proSkillSettingRepository.deleteListProSkill(
              versionId,
              transactionVersionProSkill,
            );
            await transactionVersionProSkill.commit();
            return {
              code: 200,
              id: versionId,
              updatedTime: results[0].updatedTime,
              status: results[0].status,
              publicStatus: results[0].publicStatus,
              skillId: version.skillId,
              version: results[0].version,
              subVersion: results[0].subVersion,
              reason: results[0].reason,
              lastUpdatedTime: results[0].lastUpdatedTime,
              skillActive: version.skill.active,
              skill: version.skill.name,
              skillName: version.skill.name,
              // listDepartment: departmentNames,
            };
          } catch (error) {
            await transactionVersionProSkill.rollback();
            throw new RuntimeException(
              'Error server',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
      } else {
        throw new RuntimeException('Date invalid', HttpStatus.CONFLICT);
      }
    } else {
      return {
        code: HttpStatus.FORBIDDEN,
      };
    }
  }

  async createBulk(versionId: number, data: any[]) {
    const transactionListProSkill =
      await this.proSkillSettingRepository.getTransactionListProSkill();

    try {
      await this.proSkillSettingRepository.deleteListProSkill(
        versionId,
        transactionListProSkill,
      );

      await this.proSkillSettingRepository.createMultipleData(
        data,
        transactionListProSkill,
      );

      await transactionListProSkill.commit();
    } catch {
      await transactionListProSkill.rollback();
    }
  }

  async createNewVersionSubmit(
    versionId: number,
    objectUpdated: any,
    creationUser: number,
    companyGroupCode: string,
    tempListPoint: any,
    timeZone: string,
  ): Promise<any> {
    const version = await this.proSkillSettingRepository.findOneVersion({
      id: versionId,
    });
    // ============== Check record dang cho duyet sẽ hk update ====================
    const versionWatings =
      await this.proSkillSettingRepository.findAllVersionWaiting({
        status: 3,
        skillId: version.skillId,
        companyGroupCode: companyGroupCode,
      });

    const rolesChecked = await this.proSkillSettingRepository.getRoleUser(
      version.skillId,
      creationUser,
    );
    const checkedHaveRoleSubmits =
      await this.proSkillSettingRepository.findDepartmentRoleByDepartmentId(
        version.skillId,
        2,
      );

    //**Check point difficult với version setting */
    let listPointDifferent = [];
    const listPoints = await this.versionSettingRepository.listPointSetting(
      companyGroupCode,
    );
    const listPointCheck = listPoints.settingProFormula.map((v) => ({
      value: v.point,
    }));
    for (let i = 0; i < tempListPoint.length; i++) {
      const element = tempListPoint[i];

      if (!listPointCheck.some((item) => item.value === element.difficulty)) {
        listPointDifferent.push(element.difficulty);
      }
    }
    //* end check

    if (checkedHaveRoleSubmits.length <= 0) {
      return {
        code: 405,
      };
    }
    if (rolesChecked) {
      if (versionWatings <= 0) {
        // =====================================================================
        if (
          new Date(objectUpdated.updated).getTime() ===
            version.updatedTime.getTime() &&
          listPointDifferent.length <= 0
        ) {
          const editAlreadys =
            await this.proSkillSettingRepository.findAllVersionWaiting({
              [Op.and]: [
                {
                  skillId: version.skillId,
                },
                {
                  id: { [Op.notIn]: [versionId] },
                },
                {
                  // status 1 , 3 , 5 and public status = 2
                  [Op.or]: [
                    { status: VersionProskillStatus.EDITING },
                    { status: VersionProskillStatus.PENDING_APPROVAL },
                    { status: VersionProskillStatus.REJECTED },
                    { publicStatus: VersionProskillPublicStatus.PENDING },
                  ],
                },
                {
                  companyGroupCode: companyGroupCode,
                },
              ],
            });

          if (editAlreadys > 0) {
            return {
              code: 406,
            };
          }
          if (version.status === 3 || version.status === 4) {
            const findMax = await this.proSkillSettingRepository.findMax(
              version.version,
              version.skillId,
              companyGroupCode,
            );
            const transactionVersionProSkill =
              await this.proSkillSettingRepository.getTransactionVersionProSkill();
            try {
              await this.proSkillSettingRepository.updatedVersion(
                versionId,
                {
                  status: version.status,
                },
                transactionVersionProSkill,
              );
              const dataCreate = {
                version: version.version,
                updatedTime: new Date(),
                subVersion: Math.round(findMax + 1),
                status: 3,
                skillId: version.skillId,
                reason: objectUpdated.reason,
                publicStatus: 0,
                creationUser: creationUser,
                lastUpdatedTime: isFormatDate(
                  new Date(),
                  'YYYY/M/D H:mm',
                  timeZone,
                ),
                companyGroupCode: companyGroupCode,
              };
              const newVersion =
                await this.proSkillSettingRepository.createNewVersionSaveDraft(
                  dataCreate,
                  transactionVersionProSkill,
                );
              await transactionVersionProSkill.commit();
              return {
                ...newVersion.dataValues,
                skillName: version.skill.name,
                skillActive: version.skill.active,
                code: 200,
              };
            } catch (error) {
              await transactionVersionProSkill.rollback();
              throw new RuntimeException(
                error,
                error?.status ||
                  error?.statusCode ||
                  HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          } else {
            const transactionVersionProSkill =
              await this.proSkillSettingRepository.getTransactionVersionProSkill();
            try {
              const results =
                await this.proSkillSettingRepository.updatedVersion(
                  versionId,
                  {
                    status: 3,
                    creationUser: creationUser,
                    reason: objectUpdated.reason,
                    lastUpdatedTime: isFormatDate(
                      new Date(),
                      'YYYY/M/D H:mm',
                      timeZone,
                    ),
                    companyGroupCode: companyGroupCode,
                  },
                  transactionVersionProSkill,
                );
              await transactionVersionProSkill.commit();
              return {
                id: versionId,
                updatedTime: results[0].updatedTime,
                status: results[0].status,
                publicStatus: results[0].publicStatus,
                skillId: version.skillId,
                version: results[0].version,
                subVersion: results[0].subVersion,
                reason: results[0].reason,
                skillActive: version.skillId.active,
                lastUpdatedTime: results[0].lastUpdatedTime,
                skillName: version.skill.name,
                code: 200,
              };
            } catch (error) {
              await transactionVersionProSkill.rollback();
              throw new RuntimeException(
                error,
                error?.status ||
                  error?.statusCode ||
                  HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          }
        } else {
          throw new RuntimeException('Date invalid', HttpStatus.CONFLICT);
        }
      } else {
        return {
          code: HttpStatus.UNAUTHORIZED,
        };
      }
    } else {
      return {
        code: HttpStatus.FORBIDDEN,
      };
    }
  }

  async cancelVersionPro(
    versionId: number,
    userId: number,
    updatedTime: any,
  ): Promise<any> {
    const version = await this.proSkillSettingRepository.findOneVersion({
      id: versionId,
    });
    const rolesChecked = await this.proSkillSettingRepository.getRoleUser(
      version.skillId,
      userId,
    );
    if (rolesChecked) {
      if (
        [1, 5].includes(version.status) &&
        version.updatedTime.getTime() === new Date(updatedTime).getTime()
      ) {
        const results =
          await this.proSkillSettingRepository.cancelVersionProSkill(
            versionId,
            userId,
          );
        return {
          code: 200,
          ...results[1][0].dataValues,
        };
      }
      throw new RuntimeException('No status valid or Date time', 409);
    } else {
      return {
        code: 403,
        id: versionId,
      };
    }
  }

  async getDetailProSkillVersion(
    versionId: number,
    role: string,
    companyGroupCode: string,
  ) {
    const datas = await this.proSkillSettingRepository.detailProSkill(
      versionId,
    );

    const skill = await this.proSkillSettingRepository.findOneVersion({
      id: versionId,
    });

    if (datas.length > 0) {
      // merge array same key versionProSkill => id
      const arrays = datas.reduce((acc: any, current: any) => {
        acc[current.versionId] = {
          versionId: current.versionId,
          skill: `${current.versionProSkill.skill.name}`,
          userUpdated: current.versionProSkill.user.fullName,
          updated: current.versionProSkill.updatedTime,
          publicStatus: current.versionProSkill.publicStatus,
          status: current.versionProSkill.status,
          version: `${current.versionProSkill.version}.${current.versionProSkill.subVersion}`,
          publicDate: current.versionProSkill.publicDate,
          reason: current.versionProSkill.reason,
          versionMain: current.versionProSkill.version,
          versionSub: current.versionProSkill.subVersion,
          lastUpdatedTime: current.versionProSkill.lastUpdatedTime,
          children: [],
        };
        return acc;
      }, {});

      for (let index = 0; index < datas.length; index++) {
        arrays[`${versionId}`]?.children.push({
          itemId: datas[index].itemId,
          content: datas[index].content,
          difficulty: datas[index].difficulty,
          note: datas[index].note,
          mediumClass: datas[index].mediumClass,
          smallClass: datas[index].smallClass,
          versionId: datas[index].versionId,
          jobType: datas[index].jobType,
        });
      }

      const arrayDeletes = [];
      const results = (await Object(arrays[`${versionId}`])) as {
        versionId: number;
        skill: string;
        userUpdated: string;
        updated: string;
        publicStatus: number;
        status: number;
        version: string;
        publicDate: string;
        reason: string;
        versionMain: number;
        versionSub: number;
        lastUpdatedTime: string;
        children: any[];
      };

      if (results && results.status === 3 && role === 'f4') {
        const versionPublics =
          await this.proSkillSettingRepository.getVersionPublic(
            skill.skillId,
            companyGroupCode,
          );

        for (let index = 0; index < versionPublics.length; index++) {
          const filter = results.children.find(
            (v: any) => v.itemId === versionPublics[index].itemId,
          );
          const findIndex = results.children.findIndex(
            (v: any) => v.itemId === versionPublics[index].itemId,
          );
          // 0 => change job,
          // 1 => change medium class,
          // 2 => change small class,
          // 3 => change content,
          // 4 => change difficulty ,
          // 5 => change note
          if (filter) {
            //  change job
            if (filter.jobType !== versionPublics[index].jobType) {
              results.children[findIndex].typeJob = 'change';
              results.children[findIndex].jobOld =
                versionPublics[index].jobType;
            }
            // ========================
            if (filter.mediumClass !== versionPublics[index].mediumClass) {
              results.children[findIndex].typeMediumClass = 'change';
              results.children[findIndex].mediumClassOld =
                versionPublics[index].mediumClass;
            }
            // ========================
            if (filter.smallClass !== versionPublics[index].smallClass) {
              results.children[findIndex].typeSmallClass = 'change';
              results.children[findIndex].smallClassOld =
                versionPublics[index].smallClass;
            }
            // ========================
            if (filter.content !== versionPublics[index].content) {
              results.children[findIndex].typeContent = 'change';
              results.children[findIndex].contentOld =
                versionPublics[index].content;
            }
            // ========================
            if (filter.difficulty !== versionPublics[index].difficulty) {
              results.children[findIndex].typedifficulty = 'change';
              results.children[findIndex].difficultyOld =
                versionPublics[index].difficulty;
            }
            // ========================
            if (filter.note !== versionPublics[index].note) {
              results.children[findIndex].typeNote = 'change';
              results.children[findIndex].noteOld = versionPublics[index].note;
            }
            results.children[findIndex].sort = index;
          } else {
            delete versionPublics[index].versionProSkill;
            arrayDeletes.push({
              itemId: versionPublics[index].itemId,
              versionId: versionPublics[index].versionId,
              smallClass: versionPublics[index].smallClass,
              mediumClass: versionPublics[index].mediumClass,
              jobType: versionPublics[index].jobType,
              difficulty: versionPublics[index].difficulty,
              content: versionPublics[index].content,
              note: versionPublics[index].note,
              delete: true,
              sort: index,
            });
          }
        }
        if (versionPublics.length > 0) {
          for (let index = 0; index < results.children.length; index++) {
            const filterAdd = versionPublics?.find(
              (v) => v.itemId === results.children[index].itemId,
            );
            if (!filterAdd) {
              results.children[index].isAdd = true;
              results.children[index].sort =
                versionPublics?.length + results.children.length + index;
            }
          }
        }

        await results.children.push(...arrayDeletes);

        results.children = [
          ...results.children.sort((n1, n2) => {
            if (n1?.sort > n2?.sort) {
              return 1;
            }

            if (n1?.sort < n2?.sort) {
              return -1;
            }

            return 0;
          }),
        ];

        return {
          ...results,
          skillActive: skill.skill.active,
        };
      } else {
        return {
          skillActive: skill.skill.active,
          ...(arrays[`${versionId}`] || []),
        };
      }
    } else {
      const arraySteps = await this.proSkillSettingRepository.findOneVersion({
        id: versionId,
      });

      return {
        ...arraySteps.dataValues,
        skill: `${arraySteps.dataValues.skill.name}`,
        version: `${arraySteps.dataValues.version}.${arraySteps.dataValues.subVersion}`,
        skillActive: skill.skill.active,
        userUpdated: arraySteps.dataValues.user.fullName,
        children: [],
      };
    }
  }

  async getHistoryApproveContent(
    versionId: number,
    userId: number,
    isAdmin = false,
    companyGroupCode?: string,
  ) {
    if (!versionId) throw new RuntimeException('versionId is missing', 400);
    if (!userId) throw new RuntimeException('userId is missing', 400);
    if (isNaN(versionId))
      throw new RuntimeException('versionId is not a number', 400);

    const approvalHistories = [];
    const info = { version: '', skill: '' };
    const versionInfo = await this.proSkillSettingRepository.getDetailProSkill(
      versionId,
      companyGroupCode,
    );
    if (!versionInfo) {
      throw new RuntimeException(
        'Pro skill version not found',
        HttpStatus.NOT_FOUND,
      );
    }

    info.version = versionInfo.version + '.' + versionInfo.subVersion;
    info.skill = versionInfo.skill?.name;
    if (!isAdmin) {
      const departmentRolesList =
        await this.proSkillSettingRepository.getSkillRole(
          versionInfo.skillId,
          userId,
        );
      if (!departmentRolesList.length && versionInfo.publicStatus !== 1) {
        throw new RuntimeException(
          'Unauthorized user',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    const resultList =
      await this.proSkillSettingRepository.getHistoryApproveContent(
        versionId,
        userId,
      );
    if (resultList && resultList.length) {
      resultList.map((item) => {
        const content: any = {};
        content.approverUser = item.user;
        content.createdTime = item.createdTime;
        content.comment = item.comment;
        content.status = item.status;
        approvalHistories.push(content);
      });
    }
    return { info, approvalHistories };
  }

  async getEditProSkillVersion(
    versionId: number,
    creationUser: number,
    companyGroupCode: string,
  ) {
    const datas = await this.proSkillSettingRepository.detailProSkill(
      versionId,
    );
    //  ====================== lấy list điểm version_setting_tbl ==========================
    const listPoints = await this.versionSettingRepository.listPointSetting(
      companyGroupCode,
    );
    if (datas.length > 0) {
      const rolesChecked = await this.proSkillSettingRepository.getRoleUser(
        datas[0].versionProSkill.skillId,
        creationUser,
      );
      if (!rolesChecked) {
        return {
          code: 403,
        };
      }
      const maxSubVersion = await this.proSkillSettingRepository.findMax(
        datas[0].versionProSkill.version,
        datas[0].versionProSkill.skillId,
        companyGroupCode,
      );
      const editAlreadys =
        await this.proSkillSettingRepository.findAllVersionWaiting({
          [Op.and]: [
            {
              skillId: datas[0].versionProSkill.skillId,
            },
            {
              [Op.or]: [
                { status: VersionProskillStatus.EDITING },
                { status: VersionProskillStatus.PENDING_APPROVAL },
                { status: VersionProskillStatus.REJECTED },
                { publicStatus: VersionProskillPublicStatus.PENDING },
              ],
            },
            {
              id: { [Op.notIn]: [versionId] },
            },
            {
              companyGroupCode: companyGroupCode,
            },
          ],
        });
      // let departmentNames = '';
      // if ([2].includes(datas[0].versionProSkill.department.type)) {
      //   const getAllDepartmentByGroupOrDivisions =
      //     await this.divisionSubClassRepository
      //       .getDepartmentIdByCondition({
      //         divisionId: datas[0].versionProSkill.department.id,
      //       })
      //       .then((response) => {
      //         return response.map((v) => {
      //           return `${v.department.code}: ${v.department.name}`;
      //         });
      //       });

      //   departmentNames = getAllDepartmentByGroupOrDivisions.join('、');
      // }

      // merge array same key versionProSkill => id
      const arrays = datas.reduce((acc: any, current: any) => {
        const index = acc.find((v: any) => v.versionId === current.versionId);
        const value = {
          itemId: current.itemId,
          versionId: current.versionId,
          jobType: current.jobType,
          mediumClass: current.mediumClass,
          smallClass: current.smallClass,
          content: current.content,
          difficulty: current.difficulty,
          note: current.note,
        };
        if (!index) {
          acc.push({
            versionId: current.versionId,
            skillId: current.versionProSkill.skillId,
            skillName: current.versionProSkill.skill.name,
            // department: `${current.versionProSkill.department.code}: ${current.versionProSkill.department.name}`,
            skill: current.versionProSkill.skill.name,
            updated: current.versionProSkill.updatedTime,
            publicStatus: current.versionProSkill.publicStatus,
            status: current.versionProSkill.status,
            version: `${current.versionProSkill.version}.${current.versionProSkill.subVersion}`,
            publicDate: current.versionProSkill.publicDate,
            reason: current.versionProSkill.reason,
            versionMain: current.versionProSkill.version,
            versionSub: current.versionProSkill.subVersion,
            skilltActive: datas[0].versionProSkill.skill.active,
            creationUser: current.versionProSkill.user,
            lastUpdatedTime: current.versionProSkill.lastUpdatedTime,
            // listDepartment: departmentNames,
            children: [value],
          });
        } else {
          index.children.push(value);
        }

        return acc;
      }, []);
      const lengths =
        await this.proSkillSettingRepository.findAllVersionWaiting({
          skillId: datas[0].versionProSkill.skillId,
          companyGroupCode: companyGroupCode,
        });

      // Make a object includes 2 arrays for proskill setters and approvers
      const settersAndApprovers =
        datas[0].versionProSkill.skill.skillRoles.reduce(
          (acc: { setters: string[]; approvers: string[] }, skillRole) => {
            if (skillRole.role == 1) {
              acc['setters'].push(skillRole.user.fullName);
            } else if (skillRole.role == 2) {
              acc['approvers'].push(skillRole.user.fullName);
            }

            return acc;
          },
          { setters: [], approvers: [] },
        );

      const rejectComment =
        await this.proSkillSettingRepository.getRejectComment(versionId);

      return {
        data: arrays[0],
        settersAndApprovers: settersAndApprovers,
        rejectComment: rejectComment?.comment || '',
        subVersion: maxSubVersion,
        listPoint: listPoints,
        lengths: lengths,
        editAlready: editAlreadys > 0,
      };
    } else {
      const arraySteps = await this.proSkillSettingRepository.findOneVersion({
        id: versionId,
      });
      const rolesChecked = await this.proSkillSettingRepository.getRoleUser(
        arraySteps.skillId,
        creationUser,
      );
      // let departmentNames = '';
      // if ([2].includes(arraySteps.department.type)) {
      //   const getAllDepartmentByGroupOrDivisions =
      //     await this.divisionSubClassRepository
      //       .getDepartmentIdByCondition({
      //         divisionId: arraySteps.department.id,
      //       })
      //       .then((response) => {
      //         return response.map((v) => {
      //           return `${v.department.code}: ${v.department.name}`;
      //         });
      //       });

      //   departmentNames = getAllDepartmentByGroupOrDivisions.join('、');
      // }
      if (!rolesChecked) {
        return {
          code: HttpStatus.FORBIDDEN,
        };
      }

      const maxSubVersion = await this.proSkillSettingRepository.findMax(
        arraySteps.version,
        arraySteps.skillId,
        companyGroupCode,
      );
      const lengths =
        await this.proSkillSettingRepository.findAllVersionWaiting({
          skillId: arraySteps.skillId,
          companyGroupCode: companyGroupCode,
        });
      // ====

      const editAlreadys =
        await this.proSkillSettingRepository.findAllVersionWaiting({
          [Op.and]: [
            {
              skillId: arraySteps.skillId,
            },
            {
              [Op.or]: [
                { status: VersionProskillStatus.EDITING },
                { status: VersionProskillStatus.PENDING_APPROVAL },
                { status: VersionProskillStatus.REJECTED },
                { publicStatus: VersionProskillPublicStatus.PENDING },
              ],
            },
            {
              id: { [Op.notIn]: [versionId] },
            },
            {
              companyGroupCode: companyGroupCode,
            },
          ],
        });

      // Make a object includes 2 arrays for proskill setters and approvers
      const settersAndApprovers = arraySteps.dataValues.skill.skillRoles.reduce(
        (acc: { setters: string[]; approvers: string[] }, skillRole) => {
          if (skillRole.role == 1) {
            acc['setters'].push(skillRole.user.fullName);
          } else if (skillRole.role == 2) {
            acc['approvers'].push(skillRole.user.fullName);
          }

          return acc;
        },
        { setters: [], approvers: [] },
      );

      const rejectComment =
        await this.proSkillSettingRepository.getRejectComment(versionId);

      // arraySteps.dataValues.department.departmentRoles.reduce(
      //   (acc: { setters: string[]; approvers: string[] }, departmentRole) => {
      //     if (departmentRole.role == 1) {
      //       acc['setters'].push(departmentRole.user.fullName);
      //     } else if (departmentRole.role == 2) {
      //       acc['approvers'].push(departmentRole.user.fullName);
      //     }

      //     return acc;
      //   },
      //   { setters: [], approvers: [] },
      // );

      return {
        data: {
          ...arraySteps.dataValues,
          skillId: arraySteps.dataValues.skillId,
          createdUser: arraySteps.dataValues.user,
          // department: `${arraySteps.dataValues.department.code}: ${arraySteps.dataValues.department.name}`,
          skill: arraySteps.dataValues.skill.name,
          version: `${arraySteps.dataValues.version}.${arraySteps.dataValues.subVersion}`,
          versionMain: arraySteps.dataValues.version,
          updated: arraySteps.dataValues.updatedTime,
          userUpdated: arraySteps.dataValues.user.fullName,
          publicStatus: arraySteps.dataValues.publicStatus,
          status: arraySteps.dataValues.status,
          publicDate: arraySteps.dataValues.publicDate,
          reason: arraySteps.dataValues.reason,
          versionId: parseInt(versionId.toString()),
          lastUpdatedTime: arraySteps.dataValues.lastUpdatedTime,
          // listDepartment: departmentNames,
          children: [],
        },
        rejectComment: rejectComment?.comment || '',
        settersAndApprovers: settersAndApprovers,
        subVersion: maxSubVersion,
        listPoint: listPoints,
        lengths: lengths,
        editAlready: editAlreadys > 0,
      };
    }
  }

  // async getRoleUser(
  //   departmentId: number,
  //   divisionId: number,
  //   userId: number,
  //   type: number,
  // ) {
  //   if (parseInt(type.toString()) === 1) {
  //     return await this.proSkillSettingRepository.getRoleUser(
  //       divisionId,
  //       userId,
  //     );
  //   } else {
  //     return await this.proSkillSettingRepository.getRoleUser(
  //       departmentId,
  //       userId,
  //     );
  //   }
  // }

  async createNewVersionInit(
    params,
    userId,
    skillId,
    companyGroupCode,
    timeZone,
  ): Promise<any> {
    // check Role
    const rolesChecked = await this.proSkillSettingRepository.getRoleUser(
      skillId,
      userId,
    );
    // departmentName
    const skill = await this.departmentRepository.findOnesSkill({
      id: skillId,
    });
    if (rolesChecked) {
      // check version 0.1 already exist
      const checkVersions =
        await this.proSkillSettingRepository.findAllVersionWaiting({
          [Op.and]: [
            {
              version: 0,
            },
            {
              subVersion: 1,
            },
            { skillId: skillId },
            {
              companyGroupCode: companyGroupCode,
            },
          ],
        });
      const checkedHaveRoleSubmits =
        await this.proSkillSettingRepository.findDepartmentRoleByDepartmentId(
          skillId,
          2,
        );
      if (checkedHaveRoleSubmits.length <= 0 && params.isDraft === false) {
        return {
          code: 405,
        };
      }
      if (checkVersions <= 0) {
        // let departmentNames = '';
        // if ([2].includes(department.type)) {
        //   const getAllDepartmentByGroupOrDivisions =
        //     await this.divisionSubClassRepository
        //       .getDepartmentIdByCondition({
        //         divisionId: department.id,
        //       })
        //       .then((response) => {
        //         return response.map((v) => {
        //           return `${v.department.code}: ${v.department.name}`;
        //         });
        //       });

        //   departmentNames = getAllDepartmentByGroupOrDivisions.join('、');
        // }
        //
        const transactionVersionProSkill =
          await this.proSkillSettingRepository.getTransactionVersionProSkill();
        try {
          const dataCreate = {
            version: 0,
            subVersion: 1,
            creationUser: userId,
            skillId: skillId,
            status: params.status,
            reason: params.reason,
            lastUpdatedTime: isFormatDate(
              new Date(),
              'YYYY/M/D H:mm',
              timeZone,
            ),
            publicStatus: 0,
            // type: department.type,
            companyGroupCode: companyGroupCode,
          };
          const results =
            await this.proSkillSettingRepository.createNewVersionSaveDraft(
              dataCreate,
              transactionVersionProSkill,
            );

          const childrens = params.children.map((v) => {
            delete v.id;
            delete v.version_id;
            if (isNaN(Number(v.difficulty))) {
              v.difficulty = null;
            }
            v.versionId = results.id;
            return v;
          });

          await this.proSkillSettingRepository.createMultipleData(
            childrens,
            transactionVersionProSkill,
          );
          await transactionVersionProSkill.commit();
          return {
            ...results.dataValues,
            updated: results.dataValues.updatedTime,
            skillActive: rolesChecked.skill.active,
            skillName: skill.name,
            versionId: results.id,
            versionMain: results.version,
            versionSub: results.subVersion,
            skill: skill.name,
            lastUpdatedTime: results.dataValues.lastUpdatedTime,
            // listDepartment: departmentNames,
            code: 200,
          };
        } catch (error) {
          await transactionVersionProSkill.rollback();
          throw new RuntimeException(error, 500);
        }
      } else {
        return {
          code: HttpStatus.UNAUTHORIZED,
        };
      }
    } else {
      return {
        code: HttpStatus.FORBIDDEN,
      };
    }
  }

  async getAchievementPersonal(versionId: number) {
    return await this.adminEvaluation.getAchievementPersonal(versionId);
  }

  async getAchievementAdditional(versionId: number) {
    return await this.adminEvaluation.getAchievementAdditional(
      versionId,
      TypeAchievement.PERSONAL_810,
    );
  }

  async getData810(versionId: number, req: Request) {
    const additional = await this.adminEvaluation.getAchievementAdditional(
      versionId,
      TypeAchievement.DEPARTMENT_810,
    );
    const goals = await this.adminEvaluation.getAchievementPersonal(versionId);

    const totalPoint = await this.adminEvaluation.getFormula(versionId);
    const data = await this.adminEvaluation.getData810(versionId);
    const isHaveEditRecord = await this.adminEvaluation.haveRecordEdit(req);
    return {
      goals,
      additional,
      totalPoint,
      data,
      isHaveEditRecord: isHaveEditRecord,
    };
  }

  async listPointByVersion(
    skillId: string,
    userId: number,
    companyGroupCode: string,
  ) {
    // check Role

    const rolesChecked = await this.proSkillSettingRepository.getRoleUser(
      parseInt(skillId),
      userId,
    );
    // let departmentNames = '';
    // if ([2].includes(rolesChecked.department.type)) {
    //   const getAllDepartmentByGroupOrDivisions =
    //     await this.divisionSubClassRepository
    //       .getDepartmentIdByCondition({
    //         divisionId: rolesChecked.department.id,
    //       })
    //       .then((response) => {
    //         return response.map((v) => {
    //           return `${v.department.code}: ${v.department.name}`;
    //         });
    //       });

    //   departmentNames = getAllDepartmentByGroupOrDivisions.join('、');
    // }

    // Make a object includes 2 arrays for proskill setters and approvers
    const settersAndApproversRaws =
      await this.proSkillSettingRepository.getProskillSettersAndApproversForDepartmentId(
        Number(skillId),
      );

    const settersAndApprovers = settersAndApproversRaws.reduce(
      (acc: { setters: string[]; approvers: string[] }, skillRole) => {
        if (skillRole.role == 1) {
          acc['setters'].push(skillRole.user.fullName);
        } else if (skillRole.role == 2) {
          acc['approvers'].push(skillRole.user.fullName);
        }

        return acc;
      },
      { setters: [], approvers: [] },
    );

    if (rolesChecked) {
      return {
        code: HttpStatus.OK,
        listPoint: await this.versionSettingRepository.listPointSetting(
          companyGroupCode,
        ),
        settersAndApprovers: settersAndApprovers,
        skill: rolesChecked.skill.name,
        // listDepartment: departmentNames,
      };
    } else {
      return {
        code: HttpStatus.FORBIDDEN,
      };
    }
  }

  async checkPermissionSetterOfDepartment(userId: number, versionId: number) {
    const skillRole = await this.proSkillSettingRepository.getDetailProSkill(
      versionId,
    );

    if (!skillRole) return {};

    const countCheck =
      await this.proSkillSettingRepository.checkPermissionSetterOfDepartment(
        userId,
        skillRole.skillId,
      );
    if (countCheck >= 1) {
      return {
        status: skillRole.status,
        publicStatus: skillRole.publicStatus,
      };
    } else {
      return {};
    }
  }

  async getDetailProSkill(
    versionId: number,
    userId: number,
    readonly: string,
    companyGroupCode: string,
  ) {
    const versionProSkill = (
      await this.proSkillSettingRepository.getDetailProSkillF3(versionId)
    ).get({ plain: true });

    if (versionProSkill) {
      const skillRole =
        await this.proSkillSettingRepository.checkPermissionSetterOfDepartment(
          userId,
          versionProSkill.skillId,
        );

      if (!skillRole && readonly === 'false') {
        return {
          code: HttpStatus.FORBIDDEN,
        };
      }

      const editAlreadys =
        await this.proSkillSettingRepository.findAllVersionWaiting({
          [Op.and]: [
            {
              skillId: versionProSkill.skillId,
            },
            {
              [Op.or]: [
                { status: VersionProskillStatus.EDITING },
                { status: VersionProskillStatus.PENDING_APPROVAL },
                { status: VersionProskillStatus.REJECTED },
                { publicStatus: VersionProskillPublicStatus.PENDING },
              ],
            },
            {
              id: { [Op.notIn]: [versionId] },
            },
            { companyGroupCode: companyGroupCode },
          ],
        });

      const rejectComment =
        await this.proSkillSettingRepository.getRejectComment(versionId);
      // Make a object includes 2 arrays for proskill setters and approvers
      const settersAndApprovers = versionProSkill.skill.skillRoles.reduce(
        (acc: { setters: string[]; approvers: string[] }, skillRole: any) => {
          if (skillRole.role == 1) {
            acc['setters'].push(skillRole.user.fullName);
          } else if (skillRole.role == 2) {
            acc['approvers'].push(skillRole.user.fullName);
          }

          return acc;
        },
        { setters: [], approvers: [] },
      );

      const versionResponse = {
        versionId: versionProSkill.id,
        // department: `${versionProSkill.department.code}: ${versionProSkill.department.name}`,
        // departmentType: versionProSkill.department.type,
        skill: versionProSkill.skill.name,
        userUpdated: versionProSkill.user.fullName,
        updated: versionProSkill.updatedTime,
        publicStatus: versionProSkill.publicStatus,
        status: versionProSkill.status,
        version: `${versionProSkill.version}.${versionProSkill.subVersion}`,
        publicDate: versionProSkill.publicDate,
        reason: versionProSkill.reason,
        versionMain: versionProSkill.version,
        versionSub: versionProSkill.subVersion,
        lastUpdatedTime: versionProSkill.lastUpdatedTime,
        children: versionProSkill.listProSkills,
        settersAndApprovers: settersAndApprovers,
        rejectComment: rejectComment?.comment || '',
        // listDepartment: departmentNames,
      };

      return {
        skillActive: versionProSkill.skill.active,
        ...versionResponse,
        editAlready: editAlreadys > 0,
      };
    } else {
      throw new RuntimeException('Version not found', HttpStatus.NOT_FOUND);
    }
  }

  async listVersionPublic(companyGroupCode: string) {
    const datas =
      await this.proSkillSettingRepository.detailProSkillByCondition({
        [Op.and]: [
          {
            publicStatus: 1,
            companyGroupCode: companyGroupCode,
          },
        ],
      });
    // const results = datas.reduce((acc, current) => {
    //   const index = acc.find((v) => v.versionId === current.versionId);
    //   const value = {
    //     itemId: current.itemId,
    //     versionId: current.versionId,
    //     jobType: current.jobType,
    //     mediumClass: current.mediumClass,
    //     smallClass: current.smallClass,
    //     content: current.content,
    //     difficulty: current.difficulty,
    //     note: current.note,
    //   };
    //   if (!index) {
    //     acc.push({
    //       versionId: current.versionId,
    //       skillId: current.versionProSkill.skillId,
    //       skillName: current.versionProSkill.skill.name,
    //       skill: `${current.versionProSkill.skill.name}`,
    //       updated: current.versionProSkill.updatedTime,
    //       publicStatus: current.versionProSkill.publicStatus,
    //       status: current.versionProSkill.status,
    //       version: `${current.versionProSkill.version}.${current.versionProSkill.subVersion}`,
    //       publicDate: current.versionProSkill.publicDate,
    //       reason: current.versionProSkill.reason,
    //       versionMain: current.versionProSkill.version,
    //       versionSub: current.versionProSkill.subVersion,
    //       skillActive: datas[0].versionProSkill.skill.active,
    //       creationUser: current.versionProSkill.user,
    //       lastUpdatedTime: current.versionProSkill.lastUpdatedTime,
    //       children: [value],
    //     });
    //   } else {
    //     index.children.push(value);
    //   }
    //   return acc;
    // }, []);

    return datas;
  }
}

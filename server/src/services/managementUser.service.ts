/* eslint-disable no-await-in-loop */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AddUser } from 'src/model/getUserDataOracleDto';
import { ManagementUserRepository } from 'src/repository/managementUser.repository';
import { UserRepository } from 'src/repository/user.repository';
import {
  UpdateListUserType,
  ConfirmEditListUserQuery,
} from 'src/interfaces/service/managementUser.interface';
import { DepartmentRepository } from 'src/repository/department.repository';
import { CompanyRepository } from 'src/repository/company.repository';
import { RuntimeException } from 'src/model/exception/RuntimeException';
import { compareDatePeriod } from 'src/common/util';
import { TextMessage } from './textMessage';
import { UserUpdateDto } from 'src/model/request/UserUpdateDto';
import { UserHistoryUpdateRepo } from 'src/repository/UserHistoryUpdateRepo';

@Injectable()
export class ManagemantUserServices {
  @Inject(UserRepository)
  private userRepo: UserRepository;

  @Inject(ManagementUserRepository)
  private managementUserRepository: ManagementUserRepository;

  @Inject(DepartmentRepository)
  private departmentRepository: DepartmentRepository;

  @Inject(CompanyRepository)
  private companyRepository: CompanyRepository;

  @Inject(UserHistoryUpdateRepo)
  private userHistoryUpdateRepo: UserHistoryUpdateRepo;

  async addUser(body: AddUser[], companyGroupCode: string) {
    try {
      for await (const e of body) {
        const companies = await this.managementUserRepository.addCompany(e);
        // const departments = await this.managementUserRepository.addDepartment(
        //   e,
        // );
        const companyId = companies[0].id;
        // const departmentId = departments[0].id;
        await this.managementUserRepository.addUser(
          e,
          companyId,
          companyGroupCode,
        );
      }
      return { message: 'success' };
    } catch (error) {
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getUniqueListBy(arr: any[], key: string) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  async updateListUserProcedure(
    query: UpdateListUserType,
    companyGroupCode: string,
    timeZone: string,
    createationUserId: number,
  ) {
    const textNoChange = '変更しない';

    const countUser = await this.managementUserRepository.getCountUserList(
      query.listId,
      companyGroupCode,
    );
    if (countUser !== query.listId.length) {
      throw new RuntimeException('Data is conflict', HttpStatus.CONFLICT);
    }

    const department =
      query.department === undefined
        ? null
        : query.department === textNoChange
        ? undefined
        : (query.department as number);
    const division =
      query.division === textNoChange ? undefined : (query.division as number);
    const company =
      query.company === textNoChange ? undefined : (query.company as number);

    const level =
      query.level === textNoChange ? undefined : (query.level as number);
    const userIds = query.listId;
    const flagSkill =
      query.flagSkillValue === textNoChange
        ? undefined
        : (query.flagSkillValue as number);

    const getEvaluationPeriods =
      await this.managementUserRepository.getEvaluationPeriodCurrent(
        companyGroupCode,
        timeZone,
      );

    const companyNameInput = await this.companyRepository
      .getCompanyById(company)
      .then((data) => data?.name);

    const departmentNameInput = await this.departmentRepository
      .getDepartmentById(department)
      .then((data) => data?.name);

    const divisionNameInput = await this.departmentRepository
      .getDepartmentById(division)
      .then((data) => data?.name);
    const updateResults = [];

    // Refactor từ .then() sang await để luồng xử lý đồng bộ và dễ return hơn
    await this.managementUserRepository
      .getUserList(userIds)
      .then(async (users) => {
        if (users) {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const dataUpdateUser: UserUpdateDto = {
              userIdInput: user.id,
              roles: null,
              isChangeRoleF2: false,
              isChangeRoleF3: false,
              isChangeRoleF4: false,
              typeChangeRoleF1: 0,
              periodIdInput: getEvaluationPeriods[0].id,
              radioLevelValue: query.radioLevelValue,
              companyIdInput:
                company === undefined || company == user.companyId
                  ? 0
                  : company,
              companyNameInput:
                company === undefined || company == user.companyId
                  ? ''
                  : companyNameInput,
              departmentIdInput:
                department === undefined || department == user.departmentId
                  ? 0
                  : department,
              departmentNameInput:
                department === undefined || department == user.departmentId
                  ? ''
                  : departmentNameInput,
              divisionIdInput:
                division === undefined || division == user.divisionId
                  ? 0
                  : division,
              divisionNameInput:
                division === undefined || division == user.divisionId
                  ? ''
                  : divisionNameInput,
              levelInput: !level || level == user.level ? null : level,
              levelOld: user.level,
              flagSkillValue: flagSkill ?? user.flagSkill,
              oldFlagSkill: user.flagSkill,
              listEvaluatorEvaluationIds: [],
            };

            const beforeUpdateContent = {
              company: user.company.name,
              department: user.department
                ? `${user.department.name}`
                : textNoChange,
              division: user.division ? `${user.division.name}` : textNoChange,
              level: user.level,
              flagSkill:
                flagSkill !== undefined
                  ? user.flagSkill === 1
                    ? 'あり'
                    : 'なし'
                  : textNoChange,
            };
            const afterUpdateContent = {
              company: companyNameInput ? companyNameInput : textNoChange,
              department: departmentNameInput
                ? departmentNameInput
                : textNoChange,
              division: divisionNameInput ? divisionNameInput : textNoChange,
              level: level ? level : textNoChange,
              flagSkill:
                flagSkill !== undefined
                  ? flagSkill === 1
                    ? 'あり'
                    : 'なし'
                  : textNoChange,
            };

            // 3. Đưa vào mảng kết quả theo format yêu cầu
            updateResults.push({
              userId: user.id,
              beforeUpdateContent: JSON.stringify(beforeUpdateContent),
              afterUpdateContent: JSON.stringify(afterUpdateContent),
              option:
                query.radioLevelValue === 1
                  ? '今期目標を作り直す'
                  : '今期目標の行動・情意評価項目のみ更新する',
              companyGroupCode: companyGroupCode,
              creationUserId: createationUserId,
            });

            await this.managementUserRepository.updateUserProcedure(
              dataUpdateUser,
              companyGroupCode,
              timeZone,
            );
          }
        }
      });

    if (updateResults.length > 0) {
      await this.userHistoryUpdateRepo.buildCreate(updateResults);
    }
  }

  async updateOneUserProcedure(
    userId: number,
    company: { id: number; name: string },
    department: { id: number; codeName: string },
    division: {
      id: number;
      codeName: string;
      divisionId: number;
    },
    level: number,
    levelOld: number,
    roles: number[],
    isChangeRoleF2: boolean,
    isChangeRoleF3: boolean,
    isChangeRoleF4: boolean,
    typeChangeRole1: number,
    updatedTime: any,
    radioLevelvalue: number,
    flagSkillValue: number,
    oldFlagSkill: number,
    companyGroupCode: string,
    timeZone: string,
    createationUserId: number,
    fullName: string,
  ) {
    const currentUserInfo: any = await this.userRepo.getUserDetailById(userId);
    if (
      currentUserInfo &&
      currentUserInfo.dataValues['updatedTime'].toISOString() != updatedTime
    ) {
      throw new RuntimeException('Data is conflict', HttpStatus.CONFLICT);
    }

    try {
      // update user's role
      // them clear 3 cot trong evaluator_default_tbl
      const roleChangeError = { role05: '', role1: '', role2: '' };
      const listEvaluationIds = [];
      if (roles) {
        if (isChangeRoleF2) {
          await this.processes(
            userId,
            roleChangeError,
            '0.5',
            [3, 4, 53, 54, 55],
            listEvaluationIds,
            companyGroupCode,
          );
          await this.processes(
            userId,
            roleChangeError,
            '1.0',
            [5, 6, 56, 57, 58],
            listEvaluationIds,
            companyGroupCode,
          );
          await this.processes(
            userId,
            roleChangeError,
            '2.0',
            [98],
            listEvaluationIds,
            companyGroupCode,
          );
          if (
            roleChangeError.role05 ||
            roleChangeError.role1 ||
            roleChangeError.role2
          ) {
            return roleChangeError;
          }
        }
      }

      // ** Get period in date Current
      // xem xet lai dieu kien lay period
      const getEvaluationPeriods =
        await this.managementUserRepository.getEvaluationPeriodCurrent(
          companyGroupCode,
          timeZone,
        );

      const beforeUpdateContent = {
        company:
          company !== undefined
            ? currentUserInfo?.dataValues?.companyName || undefined
            : undefined,
        department:
          department !== undefined
            ? currentUserInfo?.dataValues.department?.dataValues.name ||
              undefined
            : undefined,
        division:
          division !== undefined
            ? currentUserInfo?.dataValues.division?.dataValues.name || undefined
            : undefined,
        level: level ? levelOld : undefined,
        flagSkill:
          flagSkillValue !== undefined
            ? oldFlagSkill === 0
              ? 'なし'
              : 'あり'
            : undefined,
        roles:
          roles !== undefined
            ? currentUserInfo?.dataValues?.roles || []
            : undefined, // Tùy thuộc vào cấu trúc DB của bạn
        fullName:
          fullName !== undefined
            ? currentUserInfo?.dataValues?.fullName || undefined
            : undefined,
      };

      const dataUpdateUser: UserUpdateDto = {
        userIdInput: userId,
        roles: roles,
        isChangeRoleF2: isChangeRoleF2,
        isChangeRoleF3: isChangeRoleF3,
        isChangeRoleF4: isChangeRoleF4,
        typeChangeRoleF1: typeChangeRole1,
        periodIdInput: getEvaluationPeriods[0].id,
        radioLevelValue: radioLevelvalue,
        companyIdInput: company === undefined ? 0 : company?.id,
        companyNameInput: company === undefined ? '' : company?.name,
        departmentIdInput: department === undefined ? 0 : department?.id,
        departmentNameInput:
          department === undefined ? '' : department?.codeName,
        divisionIdInput: division === undefined ? 0 : division?.divisionId,
        divisionNameInput: division === undefined ? '' : division?.codeName,
        levelInput: !level ? null : level,
        levelOld: levelOld,
        flagSkillValue: flagSkillValue,
        oldFlagSkill: oldFlagSkill,
        listEvaluatorEvaluationIds: listEvaluationIds,
      };

      await this.managementUserRepository.updateUserProcedure(
        dataUpdateUser,
        companyGroupCode,
        timeZone,
      );
      await this.managementUserRepository.updateFullNameUser(userId, fullName);
      const afterUpdateContent = {
        company: company === undefined ? undefined : company?.name,
        department: department === undefined ? undefined : department?.codeName,
        division: division === undefined ? undefined : division?.codeName,
        level: !level ? undefined : level,
        flagSkill:
          flagSkillValue !== undefined
            ? flagSkillValue === 0
              ? 'なし'
              : 'あり'
            : undefined,
        roles: roles,
        fullName: fullName !== undefined ? fullName || undefined : undefined,
      };

      for (const key in beforeUpdateContent) {
        if (beforeUpdateContent[key] === undefined) {
          delete beforeUpdateContent[key]; // Xóa hẳn key ra khỏi object
        }
      }
      for (const key in afterUpdateContent) {
        if (afterUpdateContent[key] === undefined) {
          delete afterUpdateContent[key]; // Xóa hẳn key ra khỏi object
        }
      }

      const updatesResults = {
        userId: userId,
        beforeUpdateContent: JSON.stringify(beforeUpdateContent),
        afterUpdateContent: JSON.stringify(afterUpdateContent),
        option:
          radioLevelvalue === 1
            ? '今期目標を作り直す'
            : '今期目標の行動・情意評価項目のみ更新する',
        companyGroupCode: companyGroupCode,
        creationUserId: createationUserId,
      };

      if (updatesResults) {
        await this.userHistoryUpdateRepo.buildCreate([updatesResults]);
      }
    } catch (error) {
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // edit 1 user
  async processes(
    userId: number,
    roleChangeError: any,
    order: string,
    statusList: any,
    listEvaluationId: any[],
    companyGroupCode: string,
  ) {
    const evaluationList = await this.userRepo.getEvaluator(
      userId,
      order,
      companyGroupCode,
    );
    if (evaluationList.length) {
      evaluationList.map((evaluation: any) => {
        const temp = evaluation['dataValues'];
        Object.keys(temp).map(() => {
          const evaluationStatus = temp['status'];
          if (
            (order === '2.0' && evaluationStatus < 100) ||
            statusList.includes(evaluationStatus)
          ) {
            if (order === '0.5') roleChangeError.role05 = 'error';
            if (order === '1.0') roleChangeError.role1 = 'error';
            if (order === '2.0') roleChangeError.role2 = 'error';
          }
          const id = temp['id'];
          if (
            evaluationStatus < 100 &&
            listEvaluationId.findIndex((v) => v !== id) < 0
          ) {
            listEvaluationId.push(id);
          }
        });
      });
    }
  }

  async handleListTextChangeUserInforEvaluation(list: any[]) {
    let textChange = '';
    if (list.length > 0) {
      textChange = list?.map((v) => v?.textChange)?.join('、');
    }

    const finalText =
      textChange.length <= 0
        ? ''
        : TextMessage.textItemChanged.replace('{item}', textChange.toString());

    //**trả về object text có độ ưu tiên cao nhất (giá trị nhỏ nhất trong list có độ ưu tiên cao nhất ) */
    const highestPriorityText = list.reduce(
      (prev, curr) => (curr?.priority < prev?.priority ? curr : prev),
      list[0],
    );
    console.log(finalText, highestPriorityText);

    return finalText + highestPriorityText?.text;
  }

  async confirmEditOneUser(
    userId: number,
    company: { id: number; name: string },
    department: { id: number; codeName: string },
    division: {
      id: number;
      codeName: string;
      divisionId: number;
    },
    level: number,
    levelOld: number,
    roles: number[],
    radioLevelvalue: number,
    flagSkillValue: number,
    oldFlagSkill: number,
    companyGroupCode: string,
    timeZone: string,
  ) {
    let result = [];

    const radioLevelvalueFinal = radioLevelvalue == 2 ? 2 : 1;
    const currentUserInfo = await this.userRepo.getUserDetailById(userId);
    let textChangeUserInfor = '';
    const listTextChangeUserEvaluation = [];
    const textChangeData = 'changeData';
    const textNoChangeData = 'noChangeData';

    //** thay đổi company
    if (company && company.name) {
      textChangeUserInfor +=
        '会社: ' +
        ` ${
          currentUserInfo.company === null
            ? '未設定'
            : currentUserInfo.company.name
        } ` +
        ' → ' +
        `${company.name}` +
        '\n';
    }

    //** thay đổi division
    if (division && division.codeName) {
      textChangeUserInfor +=
        '部署名: ' +
        ` ${
          currentUserInfo.division === null
            ? '未設定'
            : currentUserInfo.division.name
        } ` +
        ' → ' +
        `${division.codeName}` +
        '\n';
    }

    //** thay đổi department
    if (department && department.codeName) {
      textChangeUserInfor +=
        '課名: ' +
        ` ${
          currentUserInfo.department === null
            ? '未設定'
            : currentUserInfo.department.name
        } ` +
        ' → ' +
        `${department.codeName}` +
        '\n';
    } else if (department === null) {
      //** xóa department */
      if (currentUserInfo.department !== null) {
        textChangeUserInfor +=
          '課名: ' +
          `${currentUserInfo.department?.name}` +
          TextMessage.textDeleteDepartment +
          '\n';
      }
    }

    //** thay đổi level
    if (level !== undefined) {
      textChangeUserInfor +=
        '等級: ' +
        ` ${
          currentUserInfo.level === null ? '未設定' : currentUserInfo.level
        } ` +
        ' → ' +
        `${level}` +
        '\n';
    }

    //** thay đổi skill
    const checkChangeFlagSkill: boolean = flagSkillValue !== oldFlagSkill;
    if (checkChangeFlagSkill) {
      textChangeUserInfor +=
        'スキル評価: ' +
        `${oldFlagSkill == 1 ? 'あり' : 'なし'}` +
        ' → ' +
        `${flagSkillValue == 1 ? 'あり' : 'なし'}` +
        '\n';
    }

    /**thay đổi role */
    if (roles && roles !== undefined) {
      const currentRole: number[] = [];
      const roleName = {
        1: '被評価者',
        2: '評価者',
        3: '専門スキル設定',
        4: '専門スキル承認',
        5: '評価管理',
        6: '各種設定',
        7: 'メール管理',
        8: 'ユーザ管理',
      };
      currentUserInfo.roles.map((item: any) => {
        currentRole.push(item.id);
      });

      const roleParseint = roles.reduce(
        (acc, x) => acc.concat(+x),
        [],
      ); /** parse array string thành array int */

      textChangeUserInfor +=
        'ロール: ' +
        `${
          currentUserInfo.roles.length == 0
            ? '未設定'
            : currentRole
                .sort((a: any, b: any) => {
                  if (a < b) {
                    return -1;
                  }
                  if (a > b) {
                    return 1;
                  }

                  return 0;
                })
                .map((i: any, index: any) => {
                  return (
                    roleName[`${i}`] +
                    (index !== currentRole.length - 1 ? '、' : '')
                  );
                })
                .toString()
                .replace(/,/g, '')
        }` +
        ' → ' +
        roleParseint
          .sort((a: any, b: any) => {
            if (a < b) {
              return -1;
            }
            if (a > b) {
              return 1;
            }

            return 0;
          })
          .map((i: any, index: any) => {
            return (
              roleName[`${i}`] + (index !== roleParseint.length - 1 ? '、' : '')
            );
          })
          .toString()
          .replace(/,/g, '');
    }

    // ** Get period in date Current
    const getEvaluationPeriods =
      await this.managementUserRepository.getEvaluationPeriodCurrent(
        companyGroupCode,
        timeZone,
      );

    if (getEvaluationPeriods) {
      const isGetStatus50 = false;
      await this.managementUserRepository
        .getEvaluationByUserIdPeriodId(
          getEvaluationPeriods[0].id,
          [userId],
          isGetStatus50,
          companyGroupCode,
          currentUserInfo.level,
        )
        .then(async (data) => {
          let checkChangeDivision = textNoChangeData;
          let checkChangeDepartment = textNoChangeData;
          let checkChangeLevel = textNoChangeData;
          let isChangeFlagSkill = false;

          //** thay đổi division
          if (division && division.codeName) {
            checkChangeDivision =
              currentUserInfo.division === null
                ? textNoChangeData
                : textChangeData;
          }

          //** thay đổi department
          if (department && department.codeName) {
            checkChangeDepartment =
              currentUserInfo.department === null
                ? textNoChangeData
                : textChangeData;
          } else if (department === null) {
            //** xóa department */
            if (currentUserInfo.department !== null) {
              checkChangeDepartment = textChangeData;
            }
          }

          //** thay đổi level
          if (level !== undefined) {
            checkChangeLevel =
              currentUserInfo.level === null
                ? textNoChangeData
                : textChangeData;
          }

          // ** thay đổi flagskill
          if (flagSkillValue !== undefined) {
            if (flagSkillValue == oldFlagSkill) {
              isChangeFlagSkill = false;
            } else {
              isChangeFlagSkill = true;
            }
          }

          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              const evaluation = data[i];
              let isChangedData =
                checkChangeDivision !== textNoChangeData ||
                checkChangeDepartment !== textNoChangeData ||
                checkChangeLevel !== textNoChangeData ||
                isChangeFlagSkill;

              //** [Option 2] Chỉ update behavior -  Trong thời gian đặt mục tiêu & Trước khi fix
              if (
                isChangedData &&
                radioLevelvalueFinal == 2 &&
                ((levelOld < 8 &&
                  compareDatePeriod(
                    evaluation.evaluationPeriod?.dateCreationGoalStart,
                    evaluation.evaluationPeriod?.dateCreationGoalEnd,
                    timeZone,
                  )) ||
                  (levelOld > 7 &&
                    compareDatePeriod(
                      evaluation.evaluationPeriod
                        ?.dateCreationGoalDepartmentStart,
                      evaluation.evaluationPeriod
                        ?.dateCreationGoalDepartmentEnd,
                      timeZone,
                    ))) &&
                evaluation.status < 50
              ) {
                //**  Chỉ thay đổi level: 1~7
                if (checkChangeLevel !== textNoChangeData) {
                  if (level < 8 && levelOld < 8) {
                    listTextChangeUserEvaluation.push({
                      priority: 1,
                      text: TextMessage.textOnlyResetBehavior17,
                    });
                  }
                }

                //**  Chỉ thay đổi level: 8~10
                if (checkChangeLevel !== textNoChangeData) {
                  if (level > 7 && levelOld > 7) {
                    listTextChangeUserEvaluation.push({
                      priority: 1,
                      text: TextMessage.textOnlyResetBehavior810,
                    });
                  }
                }

                // Bảo vệ tầng sâu (single user): trường hợp cross-boundary không thể xảy ra
                // qua UI vì displayRadioTwo đã kiểm tra isSameLevelGroup, nhưng vẫn guard ở đây
                // đề phòng gọi API trực tiếp hoặc thay đổi code trong tương lai.
                if (checkChangeLevel !== textNoChangeData) {
                  if (
                    (level > 7 && levelOld < 8) ||
                    (level < 8 && levelOld > 7)
                  ) {
                    listTextChangeUserEvaluation.push({
                      priority: 1,
                      text: TextMessage.textOption2CrossBoundaryLevel,
                    });
                  }
                }
              } else if (
                //** [Option 1] Tạo lại mục tiêu -  Trong thời gian đặt mục tiêu & Trước khi fix
                isChangedData &&
                radioLevelvalueFinal == 1 &&
                ((levelOld < 8 &&
                  compareDatePeriod(
                    evaluation.evaluationPeriod?.dateCreationGoalStart,
                    evaluation.evaluationPeriod?.dateCreationGoalEnd,
                    timeZone,
                  )) ||
                  (levelOld > 7 &&
                    compareDatePeriod(
                      evaluation.evaluationPeriod
                        ?.dateCreationGoalDepartmentStart,
                      evaluation.evaluationPeriod
                        ?.dateCreationGoalDepartmentEnd,
                      timeZone,
                    ))) &&
                evaluation.status < 50
              ) {
                //**  Chỉ thay đổi level: 1~7
                if (checkChangeLevel !== textNoChangeData) {
                  if (level < 8 && levelOld < 8) {
                    listTextChangeUserEvaluation.push({
                      textChange: TextMessage.textTitleLevel,
                      priority: 3,
                      text: TextMessage.textOnlyChangeLevelInRange17,
                    });
                  }
                }

                //**  Chỉ thay đổi level: 8~10
                if (checkChangeLevel !== textNoChangeData) {
                  if (level > 7 && levelOld > 7) {
                    listTextChangeUserEvaluation.push({
                      textChange: TextMessage.textTitleLevel,
                      priority: 3,
                      text: TextMessage.textOnlyChangeLevelInRange810,
                    });
                  }
                }

                //**  Chỉ thay đổi level: 1~7 ⇔ 8~10
                if (checkChangeLevel !== textNoChangeData) {
                  if (
                    (level >= 8 && levelOld < 8) ||
                    (level <= 7 && levelOld > 7)
                  ) {
                    listTextChangeUserEvaluation.push({
                      textChange: TextMessage.textTitleLevel,
                      priority: 3,
                      text: TextMessage.textOnlyChangeLevel1_7Bidirectional8_10,
                    });
                  }
                }

                //** Thay đổi department/devision (bất kể có thay đổi level hay không)
                if (
                  checkChangeDivision !== textNoChangeData ||
                  checkChangeDepartment !== textNoChangeData
                ) {
                  listTextChangeUserEvaluation.push({
                    textChange: TextMessage.textTitleDepDiv,
                    priority: 1,
                    text: TextMessage.textChangeDepDiv,
                  });
                }

                if (
                  //** Có skill > ko có skill
                  isChangeFlagSkill &&
                  flagSkillValue == 0
                ) {
                  listTextChangeUserEvaluation.push({
                    textChange: TextMessage.textTitleSkill,
                    priority: 2,
                    text: TextMessage.textChangeHaveSkillToNotSkill,
                  });
                } else if (
                  //** Không có skill > có skill
                  isChangeFlagSkill &&
                  flagSkillValue == 1
                ) {
                  listTextChangeUserEvaluation.push({
                    textChange: TextMessage.textTitleSkill,
                    priority: 2,
                    text: TextMessage.textChangeNotSkillToHaveSkill,
                  });
                }
              } else if (
                //** [Option 2] Chỉ update behavior -  Ngoài thời gian đặt mục tiêu & Trước khi fix
                isChangedData &&
                radioLevelvalueFinal == 2 &&
                ((levelOld < 8 &&
                  !compareDatePeriod(
                    evaluation.evaluationPeriod?.dateCreationGoalStart,
                    evaluation.evaluationPeriod?.dateCreationGoalEnd,
                    timeZone,
                  )) ||
                  (levelOld > 7 &&
                    !compareDatePeriod(
                      evaluation.evaluationPeriod
                        ?.dateCreationGoalDepartmentStart,
                      evaluation.evaluationPeriod
                        ?.dateCreationGoalDepartmentEnd,
                      timeZone,
                    ))) &&
                evaluation.status < 50
              ) {
                //**  Chỉ thay đổi level: 1~7
                if (checkChangeLevel !== textNoChangeData) {
                  if (level < 8 && levelOld < 8) {
                    listTextChangeUserEvaluation.push({
                      priority: 1,
                      text: TextMessage.textOptional2_OnlyChangeLevel17_BeforeFix,
                    });
                  }
                }

                //**  Chỉ thay đổi level: 8~10
                if (checkChangeLevel !== textNoChangeData) {
                  if (level > 7 && levelOld > 7) {
                    listTextChangeUserEvaluation.push({
                      priority: 1,
                      text: TextMessage.textOptional2_OnlyChangeLevel810_BeforeFix,
                    });
                  }
                }

                // Bảo vệ tầng sâu: tương tự block trong kỳ phía trên, cho trường hợp ngoài kỳ.
                if (checkChangeLevel !== textNoChangeData) {
                  if (
                    (level > 7 && levelOld < 8) ||
                    (level < 8 && levelOld > 7)
                  ) {
                    listTextChangeUserEvaluation.push({
                      priority: 1,
                      text: TextMessage.textOption2CrossBoundaryLevel,
                    });
                  }
                }
              } else if (
                //** [Option 1] Tạo lại mục tiêu -  Ngoài thời gian đặt mục tiêu & Trước khi fix
                isChangedData &&
                radioLevelvalueFinal == 1 &&
                ((levelOld < 8 &&
                  !compareDatePeriod(
                    evaluation.evaluationPeriod?.dateCreationGoalStart,
                    evaluation.evaluationPeriod?.dateCreationGoalEnd,
                    timeZone,
                  )) ||
                  (levelOld > 7 &&
                    !compareDatePeriod(
                      evaluation.evaluationPeriod
                        ?.dateCreationGoalDepartmentStart,
                      evaluation.evaluationPeriod
                        ?.dateCreationGoalDepartmentEnd,
                      timeZone,
                    ))) &&
                evaluation.status < 50
              ) {
                if (
                  //**  Chỉ thay đổi level: 1~7
                  (checkChangeLevel !== textNoChangeData &&
                    level < 8 &&
                    levelOld < 8) ||
                  //**  Chỉ thay đổi level: 8~10
                  (checkChangeLevel !== textNoChangeData &&
                    level > 7 &&
                    levelOld > 7) ||
                  //**  Chỉ thay đổi level: 1~7 ⇔ 8~10
                  (checkChangeLevel !== textNoChangeData &&
                    ((level >= 8 && levelOld < 8) ||
                      (level <= 7 && levelOld > 7))) ||
                  //** Thay đổi department/devision (bất kể có thay đổi level hay không)
                  checkChangeDivision !== textNoChangeData ||
                  checkChangeDepartment !== textNoChangeData ||
                  //**  Có skill > ko có skill
                  (isChangeFlagSkill && flagSkillValue == 0) ||
                  //** Không có skill > có skill
                  (isChangeFlagSkill && flagSkillValue == 1)
                ) {
                  const dataCheck = {
                    checkChangeLevel,
                    textNoChangeData,
                    level,
                    levelOld,
                    checkChangeDivision,
                    checkChangeDepartment,
                    isChangeFlagSkill,
                    flagSkillValue,
                  };
                  const itemChanged = await this.getStringChangeItem(dataCheck);

                  listTextChangeUserEvaluation.push({
                    priority: 1,
                    text:
                      itemChanged +
                      TextMessage.textOptional1_ChangeAnyThing_BeforeFix,
                  });
                }
              }
            }
          } else if (data.length == 0) {
            const count =
              await this.managementUserRepository.countEvaluationByUserId(
                getEvaluationPeriods[0].id,
                [userId],
                companyGroupCode,
              );

            const dataCheck = {
              checkChangeLevel,
              textNoChangeData,
              level,
              levelOld,
              checkChangeDivision,
              checkChangeDepartment,
              isChangeFlagSkill,
              flagSkillValue,
            };
            const itemChanged = await this.getStringChangeItem(dataCheck);
            if (count == 0) {
              //** trường hợp user ko có record đánh giá
              listTextChangeUserEvaluation.push({
                priority: 1,
                text: itemChanged + TextMessage.textNoChangeUserEvaluation,
              });
            } else {
              //** [Option 1] Tạo lại mục tiêu - Trong thời gian đặt mục tiêu & Sau khi fix hoặc Ngoài thời gian đặt mục tiêu & Sau khi fix
              listTextChangeUserEvaluation.push({
                priority: 1,
                text:
                  itemChanged +
                  TextMessage.textOptional1_ChangeAnyThing_AfterFix,
              });
            }
          }
        });
    }

    if (listTextChangeUserEvaluation.length === 0) {
      listTextChangeUserEvaluation.push({
        priority: 1,
        text: TextMessage.textNoChangeUserEvaluation,
      });
    }

    result.push({
      fullName:
        currentUserInfo.employeeNumber + ': ' + currentUserInfo.fullName,
      userInforChange: textChangeUserInfor,
      userEvaluationChange: await this.handleListTextChangeUserInforEvaluation(
        listTextChangeUserEvaluation,
      ),
    });

    return result;
  }

  async getStringChangeItem(dataCheck: any): Promise<string> {
    let listText = [];
    if (
      //**  Chỉ thay đổi level: 1~7
      (dataCheck.checkChangeLevel !== dataCheck.textNoChangeData &&
        dataCheck.level < 8 &&
        dataCheck.levelOld < 8) ||
      //**  Chỉ thay đổi level: 8~10
      (dataCheck.checkChangeLevel !== dataCheck.textNoChangeData &&
        dataCheck.level > 7 &&
        dataCheck.levelOld > 7) ||
      //**  Chỉ thay đổi level: 1~7 ⇔ 8~10
      (dataCheck.checkChangeLevel !== dataCheck.textNoChangeData &&
        ((dataCheck.level >= 8 && dataCheck.levelOld < 8) ||
          (dataCheck.level <= 7 && dataCheck.levelOld > 7)))
    ) {
      listText.push({ text: TextMessage.textTitleLevel });
    }

    if (
      //** Thay đổi department/devision (bất kể có thay đổi level hay không)
      dataCheck.checkChangeDivision !== dataCheck.textNoChangeData ||
      dataCheck.checkChangeDepartment !== dataCheck.textNoChangeData
    ) {
      listText.push({ text: TextMessage.textTitleDepDiv });
    }

    if (
      //**  Có skill > ko có skill
      (dataCheck.isChangeFlagSkill && dataCheck.flagSkillValue == 0) ||
      //** Không có skill > có skill
      (dataCheck.isChangeFlagSkill && dataCheck.flagSkillValue == 1)
    ) {
      listText.push({ text: TextMessage.textTitleSkill });
    }
    let textChange;
    if (listText.length > 0) {
      textChange = listText?.map((v) => v.text)?.join('、');
      return TextMessage.textItemChanged.replace(
        '{item}',
        textChange.toString(),
      );
    } else {
      return '';
    }
  }

  async confirmEditListUser(
    query: ConfirmEditListUserQuery,
    companyGroupCode: string,
    timeZone: string,
  ) {
    const textNoChange = '変更しない';
    const textUnSetting = '未設定';
    const textChangeData = 'changeData';
    const textNoChangeData = 'noChangeData';

    const countUser = await this.managementUserRepository.getCountUserList(
      query.listId,
      companyGroupCode,
    );
    if (countUser !== query.listId.length) {
      throw new RuntimeException('Data is conflict', HttpStatus.CONFLICT);
    }

    const department =
      query.department === textNoChange || query.department === null
        ? undefined
        : (query.department as number);

    const division =
      query.division === textNoChange ? undefined : (query.division as number);

    const company =
      query.company === textNoChange ? undefined : (query.company as number);

    const level =
      query.level === textNoChange ? undefined : (query.level as number);

    const userIds = query.listId;

    const flagSkill =
      query.flagSkillValue === textNoChange
        ? undefined
        : (query.flagSkillValue as number);

    const radioResetValue = query.radioLevelValue == 2 ? 2 : 1; // ** 2: reset behavior, 1: reset all

    let listResult = [];

    const departmentInfor = await this.departmentRepository
      .getDepartmentById(department)
      .then((data) => ({ id: data?.id, name: data?.name, code: data?.code }));
    const divisionInfor = await this.departmentRepository
      .getDepartmentById(division)
      .then((data) => ({ id: data?.id, name: data?.name, code: data?.code }));
    const companyInfor = await this.companyRepository
      .getCompanyById(company)
      .then((data) => ({ id: data?.id, name: data?.name }));

    await this.managementUserRepository
      .getListUserInforCurrent(userIds)
      .then(async (users) => {
        if (users) {
          for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const listTextContentChangeEvaluation = [];
            // ** Phần thay đổi thông tin user
            // ** thay đổi company
            let textChangeCompany = '';
            if (company !== undefined) {
              if (users.length == 1) {
                if (company !== user?.company?.id) {
                  textChangeCompany =
                    '会社: ' +
                    `${
                      user?.company === null
                        ? textUnSetting + '\n'
                        : user.company.name +
                          ' → ' +
                          `${companyInfor.name}` +
                          '\n'
                    }`;
                }
              } else {
                textChangeCompany =
                  '会社: ' +
                  `${
                    user?.company?.name == companyInfor.name
                      ? textNoChange + '\n'
                      : user?.company === null
                      ? textUnSetting + ' → ' + `${companyInfor.name}` + '\n'
                      : user.company.name +
                        ' → ' +
                        `${companyInfor.name}` +
                        '\n'
                  }`;
              }
            }

            // ** thay đổi division
            let textChangeDivision = '';
            if (division !== undefined) {
              if (users.length == 1) {
                if (division !== user?.division?.id) {
                  textChangeDivision =
                    '部署名: ' +
                    `${
                      user.division === null
                        ? textUnSetting +
                          ' → ' +
                          `${divisionInfor?.name}` +
                          '\n'
                        : user?.division?.name +
                          ' → ' +
                          `${divisionInfor?.name}` +
                          '\n'
                    }`;
                }
              } else {
                textChangeDivision =
                  '部署名: ' +
                  `${
                    user?.division?.name == divisionInfor?.name
                      ? textNoChange + '\n'
                      : user.division === null
                      ? textUnSetting + ' → ' + `${divisionInfor?.name}` + '\n'
                      : user?.division?.name +
                        ' → ' +
                        `${divisionInfor?.name}` +
                        '\n'
                  }`;
              }
            }

            // ** thay đổi department
            let textChangeDepartment = '';
            if (users.length == 1) {
              //**thay dổi 1 user */
              if (level !== undefined) {
                if (users.length == 1) {
                  if (level < 8) {
                    //** department bậc lương 1-7 */
                    if (department !== undefined) {
                      if (department !== user?.department?.id) {
                        textChangeDepartment =
                          '課名: ' +
                          `${
                            user.department === null
                              ? textUnSetting +
                                ' → ' +
                                `${departmentInfor?.name}` +
                                '\n'
                              : user?.department?.name +
                                ' → ' +
                                `${departmentInfor?.name}` +
                                '\n'
                          }`;
                      }
                    }
                  } else if (level >= 8) {
                    //** department bậc lương 8-10 */
                    if (department !== undefined) {
                      //** update mới (đổi hoặc thêm department ) */
                      if (department !== user?.department?.id) {
                        textChangeDepartment =
                          '課名: ' +
                          `${
                            user.department === null
                              ? textUnSetting +
                                ' → ' +
                                `${departmentInfor?.name}` +
                                '\n'
                              : user?.department?.name +
                                ' → ' +
                                `${departmentInfor?.name}` +
                                '\n'
                          }`;
                      }
                    } else {
                      //** xóa department */
                      if (user.department !== null) {
                        textChangeDepartment =
                          '課名: ' +
                          `${user?.department?.name}` +
                          TextMessage.textDeleteDepartment +
                          '\n';
                      }
                    }
                  }
                }
              }
            } else {
              //** thay đổi list user */
              if (department !== undefined) {
                textChangeDepartment =
                  '課名: ' +
                  `${
                    user?.department?.name == departmentInfor?.name
                      ? textNoChange + '\n'
                      : user.department === null
                      ? textUnSetting +
                        ' → ' +
                        `${departmentInfor?.name}` +
                        '\n'
                      : user?.department?.name +
                        ' → ' +
                        `${departmentInfor?.name}` +
                        '\n'
                  }`;
              }
            }

            // ** thay đổi level
            let textChangeLevel = '';
            if (level !== undefined) {
              if (users.length == 1) {
                if (level !== user?.level) {
                  textChangeLevel =
                    '等級: ' +
                    `${
                      user?.level === null
                        ? textUnSetting + ' → ' + `${level}` + '\n'
                        : user?.level + ' → ' + level + '\n'
                    }`;
                }
              } else {
                textChangeLevel =
                  '等級: ' +
                  `${
                    user.level !== null && user.level == level
                      ? textNoChange + '\n'
                      : user?.level === null
                      ? textUnSetting + ' → ' + `${level}` + '\n'
                      : user?.level + ' → ' + level + '\n'
                  }`;
              }
            }

            // ** thay đổi flag skill
            let textChangeSkill = '';
            if (flagSkill !== undefined) {
              if (users.length == 1) {
                if (flagSkill !== user.flagSkill) {
                  textChangeSkill =
                    'スキル評価: ' +
                    `${
                      `${user.flagSkill == 1 ? 'あり' : 'なし'}` +
                      ' → ' +
                      `${flagSkill == 1 ? 'あり' : 'なし'}`
                    } `;
                }
              } else {
                textChangeSkill =
                  'スキル評価: ' +
                  `${
                    flagSkill == user.flagSkill
                      ? textNoChange
                      : `${user.flagSkill == 1 ? 'あり' : 'なし'}` +
                        ' → ' +
                        `${flagSkill == 1 ? 'あり' : 'なし'}`
                  } `;
              }
            }
            // ** End phần thay đổi thông tin user

            // ** Phần thay đổi thông tin evaluation của user
            // ** Get period in date Current
            const getEvaluationPeriods =
              await this.managementUserRepository.getEvaluationPeriodCurrent(
                companyGroupCode,
                timeZone,
              );
            const isGetStatus50 = false;
            if (getEvaluationPeriods) {
              await this.managementUserRepository
                .getEvaluationByUserIdPeriodId(
                  getEvaluationPeriods[0].id,
                  [user.id],
                  isGetStatus50,
                  companyGroupCode,
                  user.level,
                )
                .then(async (data) => {
                  if (data.length > 0) {
                    const evaluation = data[0];
                    const levelOld = evaluation.level;
                    const flagSkillOld = evaluation.flagSkill;

                    let checkChangeDivision = textNoChangeData;
                    let checkChangeDepartment = textNoChangeData;
                    let checkChangeLevel = textNoChangeData;
                    let isChangeFlagSkill = false;

                    // ** thay đổi division
                    if (division !== undefined) {
                      if (users.length == 1) {
                        if (division !== user?.division?.id) {
                          checkChangeDivision =
                            user.division === null
                              ? textNoChangeData
                              : textChangeData;
                        }
                      } else {
                        checkChangeDivision =
                          user?.division?.name == divisionInfor?.name
                            ? textNoChangeData
                            : user.division === null
                            ? textNoChangeData
                            : textChangeData;
                      }
                    }

                    // ** thay đổi department
                    if (users.length == 1) {
                      //**thay dổi 1 user */
                      if (level !== undefined) {
                        if (users.length == 1) {
                          if (level < 8) {
                            //** department bậc lương 1-7 */
                            if (department !== undefined) {
                              if (department !== user?.department?.id) {
                                checkChangeDepartment =
                                  user.department === null
                                    ? textNoChangeData
                                    : textChangeData;
                              }
                            }
                          } else if (level >= 8) {
                            //** department bậc lương 8-10 */
                            if (department !== undefined) {
                              //** update mới (đổi hoặc thêm department ) */
                              if (department !== user?.department?.id) {
                                checkChangeDepartment = textChangeData;
                              }
                            } else {
                              //** xóa department */
                              if (user.department !== null) {
                                checkChangeDepartment = textChangeData;
                              }
                            }
                          }
                        }
                      }
                    } else {
                      //** thay đổi list user */
                      if (department !== undefined) {
                        checkChangeDepartment =
                          user?.department?.name == departmentInfor?.name
                            ? textNoChangeData
                            : user.department === null
                            ? textChangeData
                            : textChangeData;
                      }
                    }

                    // ** thay đổi level
                    if (level !== undefined) {
                      if (users.length == 1) {
                        if (level !== user?.level) {
                          checkChangeLevel =
                            user?.level === null
                              ? textNoChangeData
                              : textChangeData;
                        }
                      } else {
                        checkChangeLevel =
                          user.level !== null && user.level == level
                            ? textNoChangeData
                            : user?.level === null
                            ? textNoChangeData
                            : textChangeData;
                      }
                    }

                    // ** thay đổi flagskill
                    if (flagSkill !== undefined) {
                      if (users.length == 1) {
                        if (flagSkill == flagSkillOld) {
                          isChangeFlagSkill = false;
                        } else {
                          isChangeFlagSkill = true;
                        }
                      } else {
                        if (flagSkill == flagSkillOld) {
                          isChangeFlagSkill = false;
                        } else {
                          isChangeFlagSkill = true;
                        }
                      }
                    }

                    let isChangedData =
                      checkChangeDivision !== textNoChangeData ||
                      checkChangeDepartment !== textNoChangeData ||
                      checkChangeLevel !== textNoChangeData ||
                      isChangeFlagSkill;

                    //** [Option 2] Chỉ update behavior - Trong thời gian đặt mục tiêu & Trước khi fix
                    if (
                      isChangedData &&
                      radioResetValue == 2 &&
                      ((levelOld < 8 &&
                        compareDatePeriod(
                          evaluation.evaluationPeriod?.dateCreationGoalStart,
                          evaluation.evaluationPeriod?.dateCreationGoalEnd,
                          timeZone,
                        )) ||
                        (levelOld > 7 &&
                          compareDatePeriod(
                            evaluation.evaluationPeriod
                              ?.dateCreationGoalDepartmentStart,
                            evaluation.evaluationPeriod
                              ?.dateCreationGoalDepartmentEnd,
                            timeZone,
                          ))) &&
                      evaluation.status < 50
                    ) {
                      //**  Chỉ thay đổi level: 1~7
                      if (checkChangeLevel !== textNoChangeData) {
                        if (level < 8 && levelOld < 8) {
                          listTextContentChangeEvaluation.push({
                            priority: 1,
                            text: TextMessage.textOnlyResetBehavior17,
                          });
                        }
                      }

                      //**  Chỉ thay đổi level: 8~10
                      if (checkChangeLevel !== textNoChangeData) {
                        if (level > 7 && levelOld > 7) {
                          listTextContentChangeEvaluation.push({
                            priority: 1,
                            text: TextMessage.textOnlyResetBehavior810,
                          });
                        }
                      }

                      // Bug 2: user có level thay đổi qua ranh giới (1–7 ↔ 8–10) với Option 2.
                      // SQL procedure (update_user.sql) sẽ bỏ qua evaluation_tbl cho user này;
                      // chỉ user_tbl.level được cập nhật.
                      // Hiển thị message rõ ràng để admin biết evaluation record không thay đổi
                      // là có chủ đích, thay vì để hiện "変更情報がありません" gây nhầm lẫn.
                      if (checkChangeLevel !== textNoChangeData) {
                        if (
                          (level > 7 && levelOld < 8) ||
                          (level < 8 && levelOld > 7)
                        ) {
                          listTextContentChangeEvaluation.push({
                            priority: 1,
                            text: TextMessage.textOption2CrossBoundaryLevel,
                          });
                        }
                      }
                    } else if (
                      //** [Option 1] Tạo lại mục tiêu -  Trong thời gian đặt mục tiêu & Trước khi fix
                      isChangedData &&
                      radioResetValue == 1 &&
                      ((levelOld < 8 &&
                        compareDatePeriod(
                          evaluation.evaluationPeriod?.dateCreationGoalStart,
                          evaluation.evaluationPeriod?.dateCreationGoalEnd,
                          timeZone,
                        )) ||
                        (levelOld > 7 &&
                          compareDatePeriod(
                            evaluation.evaluationPeriod
                              ?.dateCreationGoalDepartmentStart,
                            evaluation.evaluationPeriod
                              ?.dateCreationGoalDepartmentEnd,
                            timeZone,
                          ))) &&
                      evaluation.status < 50
                    ) {
                      //**  Chỉ thay đổi level: 1~7
                      if (checkChangeLevel !== textNoChangeData) {
                        if (level < 8 && levelOld < 8) {
                          listTextContentChangeEvaluation.push({
                            textChange: TextMessage.textTitleLevel,
                            priority: 3,
                            text: TextMessage.textOnlyChangeLevelInRange17,
                          });
                        }
                      }

                      //**  Chỉ thay đổi level: 8~10
                      if (checkChangeLevel !== textNoChangeData) {
                        if (level > 7 && levelOld > 7) {
                          listTextContentChangeEvaluation.push({
                            textChange: TextMessage.textTitleLevel,
                            priority: 3,
                            text: TextMessage.textOnlyChangeLevelInRange810,
                          });
                        }
                      }

                      //**  Chỉ thay đổi level: 1~7 ⇔ 8~10
                      if (checkChangeLevel !== textNoChangeData) {
                        if (
                          (level >= 8 && levelOld < 8) ||
                          (level <= 7 && levelOld > 7)
                        ) {
                          listTextContentChangeEvaluation.push({
                            textChange: TextMessage.textTitleLevel,
                            priority: 3,
                            text: TextMessage.textOnlyChangeLevel1_7Bidirectional8_10,
                          });
                        }
                      }

                      //** Thay đổi department/devision (bất kể có thay đổi level hay không)
                      if (
                        checkChangeDivision !== textNoChangeData ||
                        checkChangeDepartment !== textNoChangeData
                      ) {
                        listTextContentChangeEvaluation.push({
                          textChange: TextMessage.textTitleDepDiv,
                          priority: 1,
                          text: TextMessage.textChangeDepDiv,
                        });
                      }

                      if (
                        //** Có skill > ko có skill
                        isChangeFlagSkill &&
                        flagSkill == 0
                      ) {
                        listTextContentChangeEvaluation.push({
                          textChange: TextMessage.textTitleSkill,
                          priority: 2,
                          text: TextMessage.textChangeHaveSkillToNotSkill,
                        });
                      } else if (
                        //** Không có skill > có skill
                        isChangeFlagSkill &&
                        flagSkill == 1
                      ) {
                        listTextContentChangeEvaluation.push({
                          textChange: TextMessage.textTitleSkill,
                          priority: 2,
                          text: TextMessage.textChangeNotSkillToHaveSkill,
                        });
                      }
                    } else if (
                      //** [Option 2] Chỉ update behavior -  Ngoài thời gian đặt mục tiêu & Trước khi fix
                      isChangedData &&
                      radioResetValue == 2 &&
                      ((levelOld < 8 &&
                        !compareDatePeriod(
                          evaluation.evaluationPeriod?.dateCreationGoalStart,
                          evaluation.evaluationPeriod?.dateCreationGoalEnd,
                          timeZone,
                        )) ||
                        (levelOld > 7 &&
                          !compareDatePeriod(
                            evaluation.evaluationPeriod
                              ?.dateCreationGoalDepartmentStart,
                            evaluation.evaluationPeriod
                              ?.dateCreationGoalDepartmentEnd,
                            timeZone,
                          ))) &&
                      evaluation.status < 50
                    ) {
                      //**  Chỉ thay đổi level: 1~7
                      if (checkChangeLevel !== textNoChangeData) {
                        if (level < 8 && levelOld < 8) {
                          listTextContentChangeEvaluation.push({
                            priority: 1,
                            text: TextMessage.textOptional2_OnlyChangeLevel17_BeforeFix,
                          });
                        }
                      }

                      //**  Chỉ thay đổi level: 8~10
                      if (checkChangeLevel !== textNoChangeData) {
                        if (level > 7 && levelOld > 7) {
                          listTextContentChangeEvaluation.push({
                            priority: 1,
                            text: TextMessage.textOptional2_OnlyChangeLevel810_BeforeFix,
                          });
                        }
                      }

                      // Bug 2: tương tự block trong kỳ đặt mục tiêu phía trên,
                      // nhưng cho trường hợp ngoài kỳ đặt mục tiêu.
                      if (checkChangeLevel !== textNoChangeData) {
                        if (
                          (level > 7 && levelOld < 8) ||
                          (level < 8 && levelOld > 7)
                        ) {
                          listTextContentChangeEvaluation.push({
                            priority: 1,
                            text: TextMessage.textOption2CrossBoundaryLevel,
                          });
                        }
                      }
                    } else if (
                      //** [Option 1] Tạo lại mục tiêu -  Ngoài thời gian đặt mục tiêu & Trước khi fix
                      isChangedData &&
                      radioResetValue == 1 &&
                      ((levelOld < 8 &&
                        !compareDatePeriod(
                          evaluation.evaluationPeriod?.dateCreationGoalStart,
                          evaluation.evaluationPeriod?.dateCreationGoalEnd,
                          timeZone,
                        )) ||
                        (levelOld > 7 &&
                          !compareDatePeriod(
                            evaluation.evaluationPeriod
                              ?.dateCreationGoalDepartmentStart,
                            evaluation.evaluationPeriod
                              ?.dateCreationGoalDepartmentEnd,
                            timeZone,
                          ))) &&
                      evaluation.status < 50
                    ) {
                      if (
                        //**  Chỉ thay đổi level: 1~7
                        (checkChangeLevel !== textNoChangeData &&
                          level < 8 &&
                          levelOld < 8) ||
                        //**  Chỉ thay đổi level: 8~10
                        (checkChangeLevel !== textNoChangeData &&
                          level > 7 &&
                          levelOld > 7) ||
                        //**  Chỉ thay đổi level: 1~7 ⇔ 8~10
                        (checkChangeLevel !== textNoChangeData &&
                          ((level >= 8 && levelOld < 8) ||
                            (level <= 7 && levelOld > 7))) ||
                        //** Thay đổi department/devision (bất kể có thay đổi level hay không)
                        checkChangeDivision !== textNoChangeData ||
                        checkChangeDepartment !== textNoChangeData ||
                        //**  Có skill > ko có skill
                        (isChangeFlagSkill && flagSkill == 0) ||
                        //** Không có skill > có skill
                        (isChangeFlagSkill && flagSkill == 1)
                      ) {
                        const dataCheck = {
                          checkChangeLevel,
                          textNoChangeData,
                          level,
                          levelOld,
                          checkChangeDivision,
                          checkChangeDepartment,
                          isChangeFlagSkill,
                          flagSkillValue: flagSkill,
                        };
                        const itemChanged = await this.getStringChangeItem(
                          dataCheck,
                        );

                        listTextContentChangeEvaluation.push({
                          priority: 1,
                          text:
                            itemChanged +
                            TextMessage.textOptional1_ChangeAnyThing_BeforeFix,
                        });
                      }
                    }
                  } else if (data.length == 0) {
                    const count =
                      await this.managementUserRepository.countEvaluationByUserId(
                        getEvaluationPeriods[0].id,
                        [user.id],
                        companyGroupCode,
                      );

                    let listText = [];
                    if (
                      //**  Chỉ thay đổi level: 1~7
                      //**  Chỉ thay đổi level: 8~10
                      //**  Chỉ thay đổi level: 1~7 ⇔ 8~10
                      textChangeLevel
                    ) {
                      listText.push({ text: TextMessage.textTitleLevel });
                    }

                    if (
                      //** Thay đổi department/devision (bất kể có thay đổi level hay không)
                      textChangeDivision ||
                      textChangeDepartment
                    ) {
                      listText.push({ text: TextMessage.textTitleDepDiv });
                    }

                    if (
                      //**  Có skill > ko có skill
                      //** Không có skill > có skill
                      textChangeSkill
                    ) {
                      listText.push({ text: TextMessage.textTitleSkill });
                    }

                    let textChange = '';
                    if (listText.length > 0) {
                      textChange = listText?.map((v) => v.text)?.join('、');
                    }

                    if (count == 0) {
                      //**  trường hợp user ko có record đánh giá
                      listTextContentChangeEvaluation.push({
                        priority: 1,
                        text:
                          TextMessage.textItemChanged.replace(
                            '{item}',
                            textChange.toString(),
                          ) + TextMessage.textNoChangeUserEvaluation,
                      });
                    } else {
                      //** [Option 1] Tạo lại mục tiêu - Trong thời gian đặt mục tiêu & Sau khi fix hoặc Ngoài thời gian đặt mục tiêu & Sau khi fix
                      listTextContentChangeEvaluation.push({
                        priority: 1,
                        text:
                          TextMessage.textItemChanged.replace(
                            '{item}',
                            textChange.toString(),
                          ) + TextMessage.textOptional1_ChangeAnyThing_AfterFix,
                      });
                    }
                  }
                });
            }

            if (listTextContentChangeEvaluation.length === 0) {
              //**  trường hợp user ko có record đánh giá
              listTextContentChangeEvaluation.push({
                priority: 1,
                text: TextMessage.textNoChangeUserEvaluation,
              });
            }
            // ** End phần thay đổi thông tin evaluation của user

            // ** Final data result
            listResult.push({
              fullName: user.employeeNumber + ': ' + user.fullName,
              employeeNumber: user.employeeNumber,
              userInforChange:
                textChangeCompany +
                textChangeDivision +
                textChangeDepartment +
                textChangeLevel +
                textChangeSkill,
              userEvaluationChange:
                await this.handleListTextChangeUserInforEvaluation(
                  listTextContentChangeEvaluation,
                ),
            });
          }
        }
      });

    listResult.sort((a, b) => a.employeeNumber.localeCompare(b.employeeNumber)); // sort tăng dần theo employeeNumber

    return listResult;
  }

  async historyUpdateUserList(companyGroupCode: string, userId: string) {
    return await this.userHistoryUpdateRepo.getHistoryUpdateUserList(
      companyGroupCode,
      userId,
    );
  }

  async changeRoleUserManagement(
    userId: number,
    roles: any[],
    companyGroupCode: string,
    isChangeRoleF2: boolean,
    isChangeRoleF3: boolean,
    isChangeRoleF4: boolean,
    typeChangeRoleF1: number,
    timeZone,
  ) {
    const roleChangeError = { role05: '', role1: '', role2: '' };
    const listEvaluationIds = [];
    if (roles) {
      if (isChangeRoleF2) {
        await this.processes(
          userId,
          roleChangeError,
          '0.5',
          [3, 4, 53, 54, 55],
          listEvaluationIds,
          companyGroupCode,
        );
        await this.processes(
          userId,
          roleChangeError,
          '1.0',
          [5, 6, 56, 57, 58],
          listEvaluationIds,
          companyGroupCode,
        );
        await this.processes(
          userId,
          roleChangeError,
          '2.0',
          [98],
          listEvaluationIds,
          companyGroupCode,
        );
        if (
          roleChangeError.role05 ||
          roleChangeError.role1 ||
          roleChangeError.role2
        ) {
          return roleChangeError;
        }
      }
    }

    try {
      return await this.managementUserRepository.changeRoleUserManagement(
        userId,
        roles,
        companyGroupCode,
      );
    } catch (error) {
      throw new RuntimeException(
        error,
        error?.status || error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFullNameUser(userId: number, fullName: string) {
    return await this.managementUserRepository.updateFullNameUser(
      userId,
      fullName,
    );
  }
}

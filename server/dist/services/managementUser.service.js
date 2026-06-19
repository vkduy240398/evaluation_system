"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagemantUserServices = void 0;
const common_1 = require("@nestjs/common");
const managementUser_repository_1 = require("../repository/managementUser.repository");
const user_repository_1 = require("../repository/user.repository");
const department_repository_1 = require("../repository/department.repository");
const company_repository_1 = require("../repository/company.repository");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const util_1 = require("../common/util");
const textMessage_1 = require("./textMessage");
const UserHistoryUpdateRepo_1 = require("../repository/UserHistoryUpdateRepo");
let ManagemantUserServices = class ManagemantUserServices {
    async addUser(body, companyGroupCode) {
        var _a, e_1, _b, _c;
        try {
            try {
                for (var _d = true, body_1 = __asyncValues(body), body_1_1; body_1_1 = await body_1.next(), _a = body_1_1.done, !_a;) {
                    _c = body_1_1.value;
                    _d = false;
                    try {
                        const e = _c;
                        const companies = await this.managementUserRepository.addCompany(e);
                        const companyId = companies[0].id;
                        await this.managementUserRepository.addUser(e, companyId, companyGroupCode);
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = body_1.return)) await _b.call(body_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return { message: 'success' };
        }
        catch (error) {
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    getUniqueListBy(arr, key) {
        return [...new Map(arr.map((item) => [item[key], item])).values()];
    }
    async updateListUserProcedure(query, companyGroupCode, timeZone, createationUserId) {
        const textNoChange = '変更しない';
        const countUser = await this.managementUserRepository.getCountUserList(query.listId, companyGroupCode);
        if (countUser !== query.listId.length) {
            throw new RuntimeException_1.RuntimeException('Data is conflict', common_1.HttpStatus.CONFLICT);
        }
        const department = query.department === undefined
            ? null
            : query.department === textNoChange
                ? undefined
                : query.department;
        const division = query.division === textNoChange ? undefined : query.division;
        const company = query.company === textNoChange ? undefined : query.company;
        const level = query.level === textNoChange ? undefined : query.level;
        const userIds = query.listId;
        const flagSkill = query.flagSkillValue === textNoChange
            ? undefined
            : query.flagSkillValue;
        const getEvaluationPeriods = await this.managementUserRepository.getEvaluationPeriodCurrent(companyGroupCode, timeZone);
        const companyNameInput = await this.companyRepository
            .getCompanyById(company)
            .then((data) => data === null || data === void 0 ? void 0 : data.name);
        const departmentNameInput = await this.departmentRepository
            .getDepartmentById(department)
            .then((data) => data === null || data === void 0 ? void 0 : data.name);
        const divisionNameInput = await this.departmentRepository
            .getDepartmentById(division)
            .then((data) => data === null || data === void 0 ? void 0 : data.name);
        const updateResults = [];
        await this.managementUserRepository
            .getUserList(userIds)
            .then(async (users) => {
            if (users) {
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    const dataUpdateUser = {
                        userIdInput: user.id,
                        roles: null,
                        isChangeRoleF2: false,
                        isChangeRoleF3: false,
                        isChangeRoleF4: false,
                        typeChangeRoleF1: 0,
                        periodIdInput: getEvaluationPeriods[0].id,
                        radioLevelValue: query.radioLevelValue,
                        companyIdInput: company === undefined || company == user.companyId
                            ? 0
                            : company,
                        companyNameInput: company === undefined || company == user.companyId
                            ? ''
                            : companyNameInput,
                        departmentIdInput: department === undefined || department == user.departmentId
                            ? 0
                            : department,
                        departmentNameInput: department === undefined || department == user.departmentId
                            ? ''
                            : departmentNameInput,
                        divisionIdInput: division === undefined || division == user.divisionId
                            ? 0
                            : division,
                        divisionNameInput: division === undefined || division == user.divisionId
                            ? ''
                            : divisionNameInput,
                        levelInput: !level || level == user.level ? null : level,
                        levelOld: user.level,
                        flagSkillValue: flagSkill !== null && flagSkill !== void 0 ? flagSkill : user.flagSkill,
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
                        flagSkill: flagSkill !== undefined
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
                        flagSkill: flagSkill !== undefined
                            ? flagSkill === 1
                                ? 'あり'
                                : 'なし'
                            : textNoChange,
                    };
                    updateResults.push({
                        userId: user.id,
                        beforeUpdateContent: JSON.stringify(beforeUpdateContent),
                        afterUpdateContent: JSON.stringify(afterUpdateContent),
                        option: query.radioLevelValue === 1
                            ? '今期目標を作り直す'
                            : '今期目標の行動・情意評価項目のみ更新する',
                        companyGroupCode: companyGroupCode,
                        creationUserId: createationUserId,
                    });
                    await this.managementUserRepository.updateUserProcedure(dataUpdateUser, companyGroupCode, timeZone);
                }
            }
        });
        if (updateResults.length > 0) {
            await this.userHistoryUpdateRepo.buildCreate(updateResults);
        }
    }
    async updateOneUserProcedure(userId, company, department, division, level, levelOld, roles, isChangeRoleF2, isChangeRoleF3, isChangeRoleF4, typeChangeRole1, updatedTime, radioLevelvalue, flagSkillValue, oldFlagSkill, companyGroupCode, timeZone, createationUserId, fullName) {
        var _a, _b, _c, _d, _e;
        const currentUserInfo = await this.userRepo.getUserDetailById(userId);
        if (currentUserInfo &&
            currentUserInfo.dataValues['updatedTime'].toISOString() != updatedTime) {
            throw new RuntimeException_1.RuntimeException('Data is conflict', common_1.HttpStatus.CONFLICT);
        }
        try {
            const roleChangeError = { role05: '', role1: '', role2: '' };
            const listEvaluationIds = [];
            if (roles) {
                if (isChangeRoleF2) {
                    await this.processes(userId, roleChangeError, '0.5', [3, 4, 53, 54, 55], listEvaluationIds, companyGroupCode);
                    await this.processes(userId, roleChangeError, '1.0', [5, 6, 56, 57, 58], listEvaluationIds, companyGroupCode);
                    await this.processes(userId, roleChangeError, '2.0', [98], listEvaluationIds, companyGroupCode);
                    if (roleChangeError.role05 ||
                        roleChangeError.role1 ||
                        roleChangeError.role2) {
                        return roleChangeError;
                    }
                }
            }
            const getEvaluationPeriods = await this.managementUserRepository.getEvaluationPeriodCurrent(companyGroupCode, timeZone);
            const beforeUpdateContent = {
                company: company !== undefined
                    ? ((_a = currentUserInfo === null || currentUserInfo === void 0 ? void 0 : currentUserInfo.dataValues) === null || _a === void 0 ? void 0 : _a.companyName) || undefined
                    : undefined,
                department: department !== undefined
                    ? ((_b = currentUserInfo === null || currentUserInfo === void 0 ? void 0 : currentUserInfo.dataValues.department) === null || _b === void 0 ? void 0 : _b.dataValues.name) ||
                        undefined
                    : undefined,
                division: division !== undefined
                    ? ((_c = currentUserInfo === null || currentUserInfo === void 0 ? void 0 : currentUserInfo.dataValues.division) === null || _c === void 0 ? void 0 : _c.dataValues.name) || undefined
                    : undefined,
                level: level ? levelOld : undefined,
                flagSkill: flagSkillValue !== undefined
                    ? oldFlagSkill === 0
                        ? 'なし'
                        : 'あり'
                    : undefined,
                roles: roles !== undefined
                    ? ((_d = currentUserInfo === null || currentUserInfo === void 0 ? void 0 : currentUserInfo.dataValues) === null || _d === void 0 ? void 0 : _d.roles) || []
                    : undefined,
                fullName: fullName !== undefined
                    ? ((_e = currentUserInfo === null || currentUserInfo === void 0 ? void 0 : currentUserInfo.dataValues) === null || _e === void 0 ? void 0 : _e.fullName) || undefined
                    : undefined,
            };
            const dataUpdateUser = {
                userIdInput: userId,
                roles: roles,
                isChangeRoleF2: isChangeRoleF2,
                isChangeRoleF3: isChangeRoleF3,
                isChangeRoleF4: isChangeRoleF4,
                typeChangeRoleF1: typeChangeRole1,
                periodIdInput: getEvaluationPeriods[0].id,
                radioLevelValue: radioLevelvalue,
                companyIdInput: company === undefined ? 0 : company === null || company === void 0 ? void 0 : company.id,
                companyNameInput: company === undefined ? '' : company === null || company === void 0 ? void 0 : company.name,
                departmentIdInput: department === undefined ? 0 : department === null || department === void 0 ? void 0 : department.id,
                departmentNameInput: department === undefined ? '' : department === null || department === void 0 ? void 0 : department.codeName,
                divisionIdInput: division === undefined ? 0 : division === null || division === void 0 ? void 0 : division.divisionId,
                divisionNameInput: division === undefined ? '' : division === null || division === void 0 ? void 0 : division.codeName,
                levelInput: !level ? null : level,
                levelOld: levelOld,
                flagSkillValue: flagSkillValue,
                oldFlagSkill: oldFlagSkill,
                listEvaluatorEvaluationIds: listEvaluationIds,
            };
            await this.managementUserRepository.updateUserProcedure(dataUpdateUser, companyGroupCode, timeZone);
            await this.managementUserRepository.updateFullNameUser(userId, fullName);
            const afterUpdateContent = {
                company: company === undefined ? undefined : company === null || company === void 0 ? void 0 : company.name,
                department: department === undefined ? undefined : department === null || department === void 0 ? void 0 : department.codeName,
                division: division === undefined ? undefined : division === null || division === void 0 ? void 0 : division.codeName,
                level: !level ? undefined : level,
                flagSkill: flagSkillValue !== undefined
                    ? flagSkillValue === 0
                        ? 'なし'
                        : 'あり'
                    : undefined,
                roles: roles,
                fullName: fullName !== undefined ? fullName || undefined : undefined,
            };
            for (const key in beforeUpdateContent) {
                if (beforeUpdateContent[key] === undefined) {
                    delete beforeUpdateContent[key];
                }
            }
            for (const key in afterUpdateContent) {
                if (afterUpdateContent[key] === undefined) {
                    delete afterUpdateContent[key];
                }
            }
            const updatesResults = {
                userId: userId,
                beforeUpdateContent: JSON.stringify(beforeUpdateContent),
                afterUpdateContent: JSON.stringify(afterUpdateContent),
                option: radioLevelvalue === 1
                    ? '今期目標を作り直す'
                    : '今期目標の行動・情意評価項目のみ更新する',
                companyGroupCode: companyGroupCode,
                creationUserId: createationUserId,
            };
            if (updatesResults) {
                await this.userHistoryUpdateRepo.buildCreate([updatesResults]);
            }
        }
        catch (error) {
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async processes(userId, roleChangeError, order, statusList, listEvaluationId, companyGroupCode) {
        const evaluationList = await this.userRepo.getEvaluator(userId, order, companyGroupCode);
        if (evaluationList.length) {
            evaluationList.map((evaluation) => {
                const temp = evaluation['dataValues'];
                Object.keys(temp).map(() => {
                    const evaluationStatus = temp['status'];
                    if ((order === '2.0' && evaluationStatus < 100) ||
                        statusList.includes(evaluationStatus)) {
                        if (order === '0.5')
                            roleChangeError.role05 = 'error';
                        if (order === '1.0')
                            roleChangeError.role1 = 'error';
                        if (order === '2.0')
                            roleChangeError.role2 = 'error';
                    }
                    const id = temp['id'];
                    if (evaluationStatus < 100 &&
                        listEvaluationId.findIndex((v) => v !== id) < 0) {
                        listEvaluationId.push(id);
                    }
                });
            });
        }
    }
    async handleListTextChangeUserInforEvaluation(list) {
        var _a;
        let textChange = '';
        if (list.length > 0) {
            textChange = (_a = list === null || list === void 0 ? void 0 : list.map((v) => v === null || v === void 0 ? void 0 : v.textChange)) === null || _a === void 0 ? void 0 : _a.join('、');
        }
        const finalText = textChange.length <= 0
            ? ''
            : textMessage_1.TextMessage.textItemChanged.replace('{item}', textChange.toString());
        const highestPriorityText = list.reduce((prev, curr) => ((curr === null || curr === void 0 ? void 0 : curr.priority) < (prev === null || prev === void 0 ? void 0 : prev.priority) ? curr : prev), list[0]);
        return finalText + (highestPriorityText === null || highestPriorityText === void 0 ? void 0 : highestPriorityText.text);
    }
    async confirmEditOneUser(userId, company, department, division, level, levelOld, roles, radioLevelvalue, flagSkillValue, oldFlagSkill, companyGroupCode, timeZone) {
        var _a;
        let result = [];
        const radioLevelvalueFinal = radioLevelvalue == 2 ? 2 : 1;
        const currentUserInfo = await this.userRepo.getUserDetailById(userId);
        let textChangeUserInfor = '';
        const listTextChangeUserEvaluation = [];
        const textChangeData = 'changeData';
        const textNoChangeData = 'noChangeData';
        if (company && company.name) {
            textChangeUserInfor +=
                '会社: ' +
                    ` ${currentUserInfo.company === null
                        ? '未設定'
                        : currentUserInfo.company.name} ` +
                    ' → ' +
                    `${company.name}` +
                    '\n';
        }
        if (division && division.codeName) {
            textChangeUserInfor +=
                '部署名: ' +
                    ` ${currentUserInfo.division === null
                        ? '未設定'
                        : currentUserInfo.division.name} ` +
                    ' → ' +
                    `${division.codeName}` +
                    '\n';
        }
        if (department && department.codeName) {
            textChangeUserInfor +=
                '課名: ' +
                    ` ${currentUserInfo.department === null
                        ? '未設定'
                        : currentUserInfo.department.name} ` +
                    ' → ' +
                    `${department.codeName}` +
                    '\n';
        }
        else if (department === null) {
            if (currentUserInfo.department !== null) {
                textChangeUserInfor +=
                    '課名: ' +
                        `${(_a = currentUserInfo.department) === null || _a === void 0 ? void 0 : _a.name}` +
                        textMessage_1.TextMessage.textDeleteDepartment +
                        '\n';
            }
        }
        if (level !== undefined) {
            textChangeUserInfor +=
                '等級: ' +
                    ` ${currentUserInfo.level === null ? '未設定' : currentUserInfo.level} ` +
                    ' → ' +
                    `${level}` +
                    '\n';
        }
        const checkChangeFlagSkill = flagSkillValue !== oldFlagSkill;
        if (checkChangeFlagSkill) {
            textChangeUserInfor +=
                'スキル評価: ' +
                    `${oldFlagSkill == 1 ? 'あり' : 'なし'}` +
                    ' → ' +
                    `${flagSkillValue == 1 ? 'あり' : 'なし'}` +
                    '\n';
        }
        if (roles && roles !== undefined) {
            const currentRole = [];
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
            currentUserInfo.roles.map((item) => {
                currentRole.push(item.id);
            });
            const roleParseint = roles.reduce((acc, x) => acc.concat(+x), []);
            textChangeUserInfor +=
                'ロール: ' +
                    `${currentUserInfo.roles.length == 0
                        ? '未設定'
                        : currentRole
                            .sort((a, b) => {
                            if (a < b) {
                                return -1;
                            }
                            if (a > b) {
                                return 1;
                            }
                            return 0;
                        })
                            .map((i, index) => {
                            return (roleName[`${i}`] +
                                (index !== currentRole.length - 1 ? '、' : ''));
                        })
                            .toString()
                            .replace(/,/g, '')}` +
                    ' → ' +
                    roleParseint
                        .sort((a, b) => {
                        if (a < b) {
                            return -1;
                        }
                        if (a > b) {
                            return 1;
                        }
                        return 0;
                    })
                        .map((i, index) => {
                        return (roleName[`${i}`] + (index !== roleParseint.length - 1 ? '、' : ''));
                    })
                        .toString()
                        .replace(/,/g, '');
        }
        const getEvaluationPeriods = await this.managementUserRepository.getEvaluationPeriodCurrent(companyGroupCode, timeZone);
        if (getEvaluationPeriods) {
            const isGetStatus50 = false;
            await this.managementUserRepository
                .getEvaluationByUserIdPeriodId(getEvaluationPeriods[0].id, [userId], isGetStatus50, companyGroupCode, currentUserInfo.level)
                .then(async (data) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                let checkChangeDivision = textNoChangeData;
                let checkChangeDepartment = textNoChangeData;
                let checkChangeLevel = textNoChangeData;
                let isChangeFlagSkill = false;
                if (division && division.codeName) {
                    checkChangeDivision =
                        currentUserInfo.division === null
                            ? textNoChangeData
                            : textChangeData;
                }
                if (department && department.codeName) {
                    checkChangeDepartment =
                        currentUserInfo.department === null
                            ? textNoChangeData
                            : textChangeData;
                }
                else if (department === null) {
                    if (currentUserInfo.department !== null) {
                        checkChangeDepartment = textChangeData;
                    }
                }
                if (level !== undefined) {
                    checkChangeLevel =
                        currentUserInfo.level === null
                            ? textNoChangeData
                            : textChangeData;
                }
                if (flagSkillValue !== undefined) {
                    if (flagSkillValue == oldFlagSkill) {
                        isChangeFlagSkill = false;
                    }
                    else {
                        isChangeFlagSkill = true;
                    }
                }
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        const evaluation = data[i];
                        let isChangedData = checkChangeDivision !== textNoChangeData ||
                            checkChangeDepartment !== textNoChangeData ||
                            checkChangeLevel !== textNoChangeData ||
                            isChangeFlagSkill;
                        if (isChangedData &&
                            radioLevelvalueFinal == 2 &&
                            ((levelOld < 8 &&
                                (0, util_1.compareDatePeriod)((_a = evaluation.evaluationPeriod) === null || _a === void 0 ? void 0 : _a.dateCreationGoalStart, (_b = evaluation.evaluationPeriod) === null || _b === void 0 ? void 0 : _b.dateCreationGoalEnd, timeZone)) ||
                                (levelOld > 7 &&
                                    (0, util_1.compareDatePeriod)((_c = evaluation.evaluationPeriod) === null || _c === void 0 ? void 0 : _c.dateCreationGoalDepartmentStart, (_d = evaluation.evaluationPeriod) === null || _d === void 0 ? void 0 : _d.dateCreationGoalDepartmentEnd, timeZone))) &&
                            evaluation.status < 50) {
                            if (checkChangeLevel !== textNoChangeData) {
                                if (level < 8 && levelOld < 8) {
                                    listTextChangeUserEvaluation.push({
                                        priority: 1,
                                        text: textMessage_1.TextMessage.textOnlyResetBehavior17,
                                    });
                                }
                            }
                            if (checkChangeLevel !== textNoChangeData) {
                                if (level > 7 && levelOld > 7) {
                                    listTextChangeUserEvaluation.push({
                                        priority: 1,
                                        text: textMessage_1.TextMessage.textOnlyResetBehavior810,
                                    });
                                }
                            }
                        }
                        else if (isChangedData &&
                            radioLevelvalueFinal == 1 &&
                            ((levelOld < 8 &&
                                (0, util_1.compareDatePeriod)((_e = evaluation.evaluationPeriod) === null || _e === void 0 ? void 0 : _e.dateCreationGoalStart, (_f = evaluation.evaluationPeriod) === null || _f === void 0 ? void 0 : _f.dateCreationGoalEnd, timeZone)) ||
                                (levelOld > 7 &&
                                    (0, util_1.compareDatePeriod)((_g = evaluation.evaluationPeriod) === null || _g === void 0 ? void 0 : _g.dateCreationGoalDepartmentStart, (_h = evaluation.evaluationPeriod) === null || _h === void 0 ? void 0 : _h.dateCreationGoalDepartmentEnd, timeZone))) &&
                            evaluation.status < 50) {
                            if (checkChangeLevel !== textNoChangeData) {
                                if (level < 8 && levelOld < 8) {
                                    listTextChangeUserEvaluation.push({
                                        textChange: textMessage_1.TextMessage.textTitleLevel,
                                        priority: 3,
                                        text: textMessage_1.TextMessage.textOnlyChangeLevelInRange17,
                                    });
                                }
                            }
                            if (checkChangeLevel !== textNoChangeData) {
                                if (level > 7 && levelOld > 7) {
                                    listTextChangeUserEvaluation.push({
                                        textChange: textMessage_1.TextMessage.textTitleLevel,
                                        priority: 3,
                                        text: textMessage_1.TextMessage.textOnlyChangeLevelInRange810,
                                    });
                                }
                            }
                            if (checkChangeLevel !== textNoChangeData) {
                                if ((level >= 8 && levelOld < 8) ||
                                    (level <= 7 && levelOld > 7)) {
                                    listTextChangeUserEvaluation.push({
                                        textChange: textMessage_1.TextMessage.textTitleLevel,
                                        priority: 3,
                                        text: textMessage_1.TextMessage.textOnlyChangeLevel1_7Bidirectional8_10,
                                    });
                                }
                            }
                            if (checkChangeDivision !== textNoChangeData ||
                                checkChangeDepartment !== textNoChangeData) {
                                listTextChangeUserEvaluation.push({
                                    textChange: textMessage_1.TextMessage.textTitleDepDiv,
                                    priority: 1,
                                    text: textMessage_1.TextMessage.textChangeDepDiv,
                                });
                            }
                            if (isChangeFlagSkill &&
                                flagSkillValue == 0) {
                                listTextChangeUserEvaluation.push({
                                    textChange: textMessage_1.TextMessage.textTitleSkill,
                                    priority: 2,
                                    text: textMessage_1.TextMessage.textChangeHaveSkillToNotSkill,
                                });
                            }
                            else if (isChangeFlagSkill &&
                                flagSkillValue == 1) {
                                listTextChangeUserEvaluation.push({
                                    textChange: textMessage_1.TextMessage.textTitleSkill,
                                    priority: 2,
                                    text: textMessage_1.TextMessage.textChangeNotSkillToHaveSkill,
                                });
                            }
                        }
                        else if (isChangedData &&
                            radioLevelvalueFinal == 2 &&
                            ((levelOld < 8 &&
                                !(0, util_1.compareDatePeriod)((_j = evaluation.evaluationPeriod) === null || _j === void 0 ? void 0 : _j.dateCreationGoalStart, (_k = evaluation.evaluationPeriod) === null || _k === void 0 ? void 0 : _k.dateCreationGoalEnd, timeZone)) ||
                                (levelOld > 7 &&
                                    !(0, util_1.compareDatePeriod)((_l = evaluation.evaluationPeriod) === null || _l === void 0 ? void 0 : _l.dateCreationGoalDepartmentStart, (_m = evaluation.evaluationPeriod) === null || _m === void 0 ? void 0 : _m.dateCreationGoalDepartmentEnd, timeZone))) &&
                            evaluation.status < 50) {
                            if (checkChangeLevel !== textNoChangeData) {
                                if (level < 8 && levelOld < 8) {
                                    listTextChangeUserEvaluation.push({
                                        priority: 1,
                                        text: textMessage_1.TextMessage.textOptional2_OnlyChangeLevel17_BeforeFix,
                                    });
                                }
                            }
                            if (checkChangeLevel !== textNoChangeData) {
                                if (level > 7 && levelOld > 7) {
                                    listTextChangeUserEvaluation.push({
                                        priority: 1,
                                        text: textMessage_1.TextMessage.textOptional2_OnlyChangeLevel810_BeforeFix,
                                    });
                                }
                            }
                        }
                        else if (isChangedData &&
                            radioLevelvalueFinal == 1 &&
                            ((levelOld < 8 &&
                                !(0, util_1.compareDatePeriod)((_o = evaluation.evaluationPeriod) === null || _o === void 0 ? void 0 : _o.dateCreationGoalStart, (_p = evaluation.evaluationPeriod) === null || _p === void 0 ? void 0 : _p.dateCreationGoalEnd, timeZone)) ||
                                (levelOld > 7 &&
                                    !(0, util_1.compareDatePeriod)((_q = evaluation.evaluationPeriod) === null || _q === void 0 ? void 0 : _q.dateCreationGoalDepartmentStart, (_r = evaluation.evaluationPeriod) === null || _r === void 0 ? void 0 : _r.dateCreationGoalDepartmentEnd, timeZone))) &&
                            evaluation.status < 50) {
                            if ((checkChangeLevel !== textNoChangeData &&
                                level < 8 &&
                                levelOld < 8) ||
                                (checkChangeLevel !== textNoChangeData &&
                                    level > 7 &&
                                    levelOld > 7) ||
                                (checkChangeLevel !== textNoChangeData &&
                                    ((level >= 8 && levelOld < 8) ||
                                        (level <= 7 && levelOld > 7))) ||
                                checkChangeDivision !== textNoChangeData ||
                                checkChangeDepartment !== textNoChangeData ||
                                (isChangeFlagSkill && flagSkillValue == 0) ||
                                (isChangeFlagSkill && flagSkillValue == 1)) {
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
                                    text: itemChanged +
                                        textMessage_1.TextMessage.textOptional1_ChangeAnyThing_BeforeFix,
                                });
                            }
                        }
                    }
                }
                else if (data.length == 0) {
                    const count = await this.managementUserRepository.countEvaluationByUserId(getEvaluationPeriods[0].id, [userId], companyGroupCode);
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
                        listTextChangeUserEvaluation.push({
                            priority: 1,
                            text: itemChanged + textMessage_1.TextMessage.textNoChangeUserEvaluation,
                        });
                    }
                    else {
                        listTextChangeUserEvaluation.push({
                            priority: 1,
                            text: itemChanged +
                                textMessage_1.TextMessage.textOptional1_ChangeAnyThing_AfterFix,
                        });
                    }
                }
            });
        }
        if (listTextChangeUserEvaluation.length === 0) {
            listTextChangeUserEvaluation.push({
                priority: 1,
                text: textMessage_1.TextMessage.textNoChangeUserEvaluation,
            });
        }
        result.push({
            fullName: currentUserInfo.employeeNumber + ': ' + currentUserInfo.fullName,
            userInforChange: textChangeUserInfor,
            userEvaluationChange: await this.handleListTextChangeUserInforEvaluation(listTextChangeUserEvaluation),
        });
        return result;
    }
    async getStringChangeItem(dataCheck) {
        var _a;
        let listText = [];
        if ((dataCheck.checkChangeLevel !== dataCheck.textNoChangeData &&
            dataCheck.level < 8 &&
            dataCheck.levelOld < 8) ||
            (dataCheck.checkChangeLevel !== dataCheck.textNoChangeData &&
                dataCheck.level > 7 &&
                dataCheck.levelOld > 7) ||
            (dataCheck.checkChangeLevel !== dataCheck.textNoChangeData &&
                ((dataCheck.level >= 8 && dataCheck.levelOld < 8) ||
                    (dataCheck.level <= 7 && dataCheck.levelOld > 7)))) {
            listText.push({ text: textMessage_1.TextMessage.textTitleLevel });
        }
        if (dataCheck.checkChangeDivision !== dataCheck.textNoChangeData ||
            dataCheck.checkChangeDepartment !== dataCheck.textNoChangeData) {
            listText.push({ text: textMessage_1.TextMessage.textTitleDepDiv });
        }
        if ((dataCheck.isChangeFlagSkill && dataCheck.flagSkillValue == 0) ||
            (dataCheck.isChangeFlagSkill && dataCheck.flagSkillValue == 1)) {
            listText.push({ text: textMessage_1.TextMessage.textTitleSkill });
        }
        let textChange;
        if (listText.length > 0) {
            textChange = (_a = listText === null || listText === void 0 ? void 0 : listText.map((v) => v.text)) === null || _a === void 0 ? void 0 : _a.join('、');
            return textMessage_1.TextMessage.textItemChanged.replace('{item}', textChange.toString());
        }
        else {
            return '';
        }
    }
    async confirmEditListUser(query, companyGroupCode, timeZone) {
        const textNoChange = '変更しない';
        const textUnSetting = '未設定';
        const textChangeData = 'changeData';
        const textNoChangeData = 'noChangeData';
        const countUser = await this.managementUserRepository.getCountUserList(query.listId, companyGroupCode);
        if (countUser !== query.listId.length) {
            throw new RuntimeException_1.RuntimeException('Data is conflict', common_1.HttpStatus.CONFLICT);
        }
        const department = query.department === textNoChange || query.department === null
            ? undefined
            : query.department;
        const division = query.division === textNoChange ? undefined : query.division;
        const company = query.company === textNoChange ? undefined : query.company;
        const level = query.level === textNoChange ? undefined : query.level;
        const userIds = query.listId;
        const flagSkill = query.flagSkillValue === textNoChange
            ? undefined
            : query.flagSkillValue;
        const radioResetValue = query.radioLevelValue == 2 ? 2 : 1;
        let listResult = [];
        const departmentInfor = await this.departmentRepository
            .getDepartmentById(department)
            .then((data) => ({ id: data === null || data === void 0 ? void 0 : data.id, name: data === null || data === void 0 ? void 0 : data.name, code: data === null || data === void 0 ? void 0 : data.code }));
        const divisionInfor = await this.departmentRepository
            .getDepartmentById(division)
            .then((data) => ({ id: data === null || data === void 0 ? void 0 : data.id, name: data === null || data === void 0 ? void 0 : data.name, code: data === null || data === void 0 ? void 0 : data.code }));
        const companyInfor = await this.companyRepository
            .getCompanyById(company)
            .then((data) => ({ id: data === null || data === void 0 ? void 0 : data.id, name: data === null || data === void 0 ? void 0 : data.name }));
        await this.managementUserRepository
            .getListUserInforCurrent(userIds)
            .then(async (users) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            if (users) {
                for (let i = 0; i < users.length; i++) {
                    const user = users[i];
                    const listTextContentChangeEvaluation = [];
                    let textChangeCompany = '';
                    if (company !== undefined) {
                        if (users.length == 1) {
                            if (company !== ((_a = user === null || user === void 0 ? void 0 : user.company) === null || _a === void 0 ? void 0 : _a.id)) {
                                textChangeCompany =
                                    '会社: ' +
                                        `${(user === null || user === void 0 ? void 0 : user.company) === null
                                            ? textUnSetting + '\n'
                                            : user.company.name +
                                                ' → ' +
                                                `${companyInfor.name}` +
                                                '\n'}`;
                            }
                        }
                        else {
                            textChangeCompany =
                                '会社: ' +
                                    `${((_b = user === null || user === void 0 ? void 0 : user.company) === null || _b === void 0 ? void 0 : _b.name) == companyInfor.name
                                        ? textNoChange + '\n'
                                        : (user === null || user === void 0 ? void 0 : user.company) === null
                                            ? textUnSetting + ' → ' + `${companyInfor.name}` + '\n'
                                            : user.company.name +
                                                ' → ' +
                                                `${companyInfor.name}` +
                                                '\n'}`;
                        }
                    }
                    let textChangeDivision = '';
                    if (division !== undefined) {
                        if (users.length == 1) {
                            if (division !== ((_c = user === null || user === void 0 ? void 0 : user.division) === null || _c === void 0 ? void 0 : _c.id)) {
                                textChangeDivision =
                                    '部署名: ' +
                                        `${user.division === null
                                            ? textUnSetting +
                                                ' → ' +
                                                `${divisionInfor === null || divisionInfor === void 0 ? void 0 : divisionInfor.name}` +
                                                '\n'
                                            : ((_d = user === null || user === void 0 ? void 0 : user.division) === null || _d === void 0 ? void 0 : _d.name) +
                                                ' → ' +
                                                `${divisionInfor === null || divisionInfor === void 0 ? void 0 : divisionInfor.name}` +
                                                '\n'}`;
                            }
                        }
                        else {
                            textChangeDivision =
                                '部署名: ' +
                                    `${((_e = user === null || user === void 0 ? void 0 : user.division) === null || _e === void 0 ? void 0 : _e.name) == (divisionInfor === null || divisionInfor === void 0 ? void 0 : divisionInfor.name)
                                        ? textNoChange + '\n'
                                        : user.division === null
                                            ? textUnSetting + ' → ' + `${divisionInfor === null || divisionInfor === void 0 ? void 0 : divisionInfor.name}` + '\n'
                                            : ((_f = user === null || user === void 0 ? void 0 : user.division) === null || _f === void 0 ? void 0 : _f.name) +
                                                ' → ' +
                                                `${divisionInfor === null || divisionInfor === void 0 ? void 0 : divisionInfor.name}` +
                                                '\n'}`;
                        }
                    }
                    let textChangeDepartment = '';
                    if (users.length == 1) {
                        if (level !== undefined) {
                            if (users.length == 1) {
                                if (level < 8) {
                                    if (department !== undefined) {
                                        if (department !== ((_g = user === null || user === void 0 ? void 0 : user.department) === null || _g === void 0 ? void 0 : _g.id)) {
                                            textChangeDepartment =
                                                '課名: ' +
                                                    `${user.department === null
                                                        ? textUnSetting +
                                                            ' → ' +
                                                            `${departmentInfor === null || departmentInfor === void 0 ? void 0 : departmentInfor.name}` +
                                                            '\n'
                                                        : ((_h = user === null || user === void 0 ? void 0 : user.department) === null || _h === void 0 ? void 0 : _h.name) +
                                                            ' → ' +
                                                            `${departmentInfor === null || departmentInfor === void 0 ? void 0 : departmentInfor.name}` +
                                                            '\n'}`;
                                        }
                                    }
                                }
                                else if (level >= 8) {
                                    if (department !== undefined) {
                                        if (department !== ((_j = user === null || user === void 0 ? void 0 : user.department) === null || _j === void 0 ? void 0 : _j.id)) {
                                            textChangeDepartment =
                                                '課名: ' +
                                                    `${user.department === null
                                                        ? textUnSetting +
                                                            ' → ' +
                                                            `${departmentInfor === null || departmentInfor === void 0 ? void 0 : departmentInfor.name}` +
                                                            '\n'
                                                        : ((_k = user === null || user === void 0 ? void 0 : user.department) === null || _k === void 0 ? void 0 : _k.name) +
                                                            ' → ' +
                                                            `${departmentInfor === null || departmentInfor === void 0 ? void 0 : departmentInfor.name}` +
                                                            '\n'}`;
                                        }
                                    }
                                    else {
                                        if (user.department !== null) {
                                            textChangeDepartment =
                                                '課名: ' +
                                                    `${(_l = user === null || user === void 0 ? void 0 : user.department) === null || _l === void 0 ? void 0 : _l.name}` +
                                                    textMessage_1.TextMessage.textDeleteDepartment +
                                                    '\n';
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if (department !== undefined) {
                            textChangeDepartment =
                                '課名: ' +
                                    `${((_m = user === null || user === void 0 ? void 0 : user.department) === null || _m === void 0 ? void 0 : _m.name) == (departmentInfor === null || departmentInfor === void 0 ? void 0 : departmentInfor.name)
                                        ? textNoChange + '\n'
                                        : user.department === null
                                            ? textUnSetting +
                                                ' → ' +
                                                `${departmentInfor === null || departmentInfor === void 0 ? void 0 : departmentInfor.name}` +
                                                '\n'
                                            : ((_o = user === null || user === void 0 ? void 0 : user.department) === null || _o === void 0 ? void 0 : _o.name) +
                                                ' → ' +
                                                `${departmentInfor === null || departmentInfor === void 0 ? void 0 : departmentInfor.name}` +
                                                '\n'}`;
                        }
                    }
                    let textChangeLevel = '';
                    if (level !== undefined) {
                        if (users.length == 1) {
                            if (level !== (user === null || user === void 0 ? void 0 : user.level)) {
                                textChangeLevel =
                                    '等級: ' +
                                        `${(user === null || user === void 0 ? void 0 : user.level) === null
                                            ? textUnSetting + ' → ' + `${level}` + '\n'
                                            : (user === null || user === void 0 ? void 0 : user.level) + ' → ' + level + '\n'}`;
                            }
                        }
                        else {
                            textChangeLevel =
                                '等級: ' +
                                    `${user.level !== null && user.level == level
                                        ? textNoChange + '\n'
                                        : (user === null || user === void 0 ? void 0 : user.level) === null
                                            ? textUnSetting + ' → ' + `${level}` + '\n'
                                            : (user === null || user === void 0 ? void 0 : user.level) + ' → ' + level + '\n'}`;
                        }
                    }
                    let textChangeSkill = '';
                    if (flagSkill !== undefined) {
                        if (users.length == 1) {
                            if (flagSkill !== user.flagSkill) {
                                textChangeSkill =
                                    'スキル評価: ' +
                                        `${`${user.flagSkill == 1 ? 'あり' : 'なし'}` +
                                            ' → ' +
                                            `${flagSkill == 1 ? 'あり' : 'なし'}`} `;
                            }
                        }
                        else {
                            textChangeSkill =
                                'スキル評価: ' +
                                    `${flagSkill == user.flagSkill
                                        ? textNoChange
                                        : `${user.flagSkill == 1 ? 'あり' : 'なし'}` +
                                            ' → ' +
                                            `${flagSkill == 1 ? 'あり' : 'なし'}`} `;
                        }
                    }
                    const getEvaluationPeriods = await this.managementUserRepository.getEvaluationPeriodCurrent(companyGroupCode, timeZone);
                    const isGetStatus50 = false;
                    if (getEvaluationPeriods) {
                        await this.managementUserRepository
                            .getEvaluationByUserIdPeriodId(getEvaluationPeriods[0].id, [user.id], isGetStatus50, companyGroupCode, user.level)
                            .then(async (data) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
                            if (data.length > 0) {
                                const evaluation = data[0];
                                const levelOld = evaluation.level;
                                const flagSkillOld = evaluation.flagSkill;
                                let checkChangeDivision = textNoChangeData;
                                let checkChangeDepartment = textNoChangeData;
                                let checkChangeLevel = textNoChangeData;
                                let isChangeFlagSkill = false;
                                if (division !== undefined) {
                                    if (users.length == 1) {
                                        if (division !== ((_a = user === null || user === void 0 ? void 0 : user.division) === null || _a === void 0 ? void 0 : _a.id)) {
                                            checkChangeDivision =
                                                user.division === null
                                                    ? textNoChangeData
                                                    : textChangeData;
                                        }
                                    }
                                    else {
                                        checkChangeDivision =
                                            ((_b = user === null || user === void 0 ? void 0 : user.division) === null || _b === void 0 ? void 0 : _b.name) == (divisionInfor === null || divisionInfor === void 0 ? void 0 : divisionInfor.name)
                                                ? textNoChangeData
                                                : user.division === null
                                                    ? textNoChangeData
                                                    : textChangeData;
                                    }
                                }
                                if (users.length == 1) {
                                    if (level !== undefined) {
                                        if (users.length == 1) {
                                            if (level < 8) {
                                                if (department !== undefined) {
                                                    if (department !== ((_c = user === null || user === void 0 ? void 0 : user.department) === null || _c === void 0 ? void 0 : _c.id)) {
                                                        checkChangeDepartment =
                                                            user.department === null
                                                                ? textNoChangeData
                                                                : textChangeData;
                                                    }
                                                }
                                            }
                                            else if (level >= 8) {
                                                if (department !== undefined) {
                                                    if (department !== ((_d = user === null || user === void 0 ? void 0 : user.department) === null || _d === void 0 ? void 0 : _d.id)) {
                                                        checkChangeDepartment = textChangeData;
                                                    }
                                                }
                                                else {
                                                    if (user.department !== null) {
                                                        checkChangeDepartment = textChangeData;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (department !== undefined) {
                                        checkChangeDepartment =
                                            ((_e = user === null || user === void 0 ? void 0 : user.department) === null || _e === void 0 ? void 0 : _e.name) == (departmentInfor === null || departmentInfor === void 0 ? void 0 : departmentInfor.name)
                                                ? textNoChangeData
                                                : user.department === null
                                                    ? textChangeData
                                                    : textChangeData;
                                    }
                                }
                                if (level !== undefined) {
                                    if (users.length == 1) {
                                        if (level !== (user === null || user === void 0 ? void 0 : user.level)) {
                                            checkChangeLevel =
                                                (user === null || user === void 0 ? void 0 : user.level) === null
                                                    ? textNoChangeData
                                                    : textChangeData;
                                        }
                                    }
                                    else {
                                        checkChangeLevel =
                                            user.level !== null && user.level == level
                                                ? textNoChangeData
                                                : (user === null || user === void 0 ? void 0 : user.level) === null
                                                    ? textNoChangeData
                                                    : textChangeData;
                                    }
                                }
                                if (flagSkill !== undefined) {
                                    if (users.length == 1) {
                                        if (flagSkill == flagSkillOld) {
                                            isChangeFlagSkill = false;
                                        }
                                        else {
                                            isChangeFlagSkill = true;
                                        }
                                    }
                                    else {
                                        if (flagSkill == flagSkillOld) {
                                            isChangeFlagSkill = false;
                                        }
                                        else {
                                            isChangeFlagSkill = true;
                                        }
                                    }
                                }
                                let isChangedData = checkChangeDivision !== textNoChangeData ||
                                    checkChangeDepartment !== textNoChangeData ||
                                    checkChangeLevel !== textNoChangeData ||
                                    isChangeFlagSkill;
                                if (isChangedData &&
                                    radioResetValue == 2 &&
                                    ((levelOld < 8 &&
                                        (0, util_1.compareDatePeriod)((_f = evaluation.evaluationPeriod) === null || _f === void 0 ? void 0 : _f.dateCreationGoalStart, (_g = evaluation.evaluationPeriod) === null || _g === void 0 ? void 0 : _g.dateCreationGoalEnd, timeZone)) ||
                                        (levelOld > 7 &&
                                            (0, util_1.compareDatePeriod)((_h = evaluation.evaluationPeriod) === null || _h === void 0 ? void 0 : _h.dateCreationGoalDepartmentStart, (_j = evaluation.evaluationPeriod) === null || _j === void 0 ? void 0 : _j.dateCreationGoalDepartmentEnd, timeZone))) &&
                                    evaluation.status < 50) {
                                    if (checkChangeLevel !== textNoChangeData) {
                                        if (level < 8 && levelOld < 8) {
                                            listTextContentChangeEvaluation.push({
                                                priority: 1,
                                                text: textMessage_1.TextMessage.textOnlyResetBehavior17,
                                            });
                                        }
                                    }
                                    if (checkChangeLevel !== textNoChangeData) {
                                        if (level > 7 && levelOld > 7) {
                                            listTextContentChangeEvaluation.push({
                                                priority: 1,
                                                text: textMessage_1.TextMessage.textOnlyResetBehavior810,
                                            });
                                        }
                                    }
                                }
                                else if (isChangedData &&
                                    radioResetValue == 1 &&
                                    ((levelOld < 8 &&
                                        (0, util_1.compareDatePeriod)((_k = evaluation.evaluationPeriod) === null || _k === void 0 ? void 0 : _k.dateCreationGoalStart, (_l = evaluation.evaluationPeriod) === null || _l === void 0 ? void 0 : _l.dateCreationGoalEnd, timeZone)) ||
                                        (levelOld > 7 &&
                                            (0, util_1.compareDatePeriod)((_m = evaluation.evaluationPeriod) === null || _m === void 0 ? void 0 : _m.dateCreationGoalDepartmentStart, (_o = evaluation.evaluationPeriod) === null || _o === void 0 ? void 0 : _o.dateCreationGoalDepartmentEnd, timeZone))) &&
                                    evaluation.status < 50) {
                                    if (checkChangeLevel !== textNoChangeData) {
                                        if (level < 8 && levelOld < 8) {
                                            listTextContentChangeEvaluation.push({
                                                textChange: textMessage_1.TextMessage.textTitleLevel,
                                                priority: 3,
                                                text: textMessage_1.TextMessage.textOnlyChangeLevelInRange17,
                                            });
                                        }
                                    }
                                    if (checkChangeLevel !== textNoChangeData) {
                                        if (level > 7 && levelOld > 7) {
                                            listTextContentChangeEvaluation.push({
                                                textChange: textMessage_1.TextMessage.textTitleLevel,
                                                priority: 3,
                                                text: textMessage_1.TextMessage.textOnlyChangeLevelInRange810,
                                            });
                                        }
                                    }
                                    if (checkChangeLevel !== textNoChangeData) {
                                        if ((level >= 8 && levelOld < 8) ||
                                            (level <= 7 && levelOld > 7)) {
                                            listTextContentChangeEvaluation.push({
                                                textChange: textMessage_1.TextMessage.textTitleLevel,
                                                priority: 3,
                                                text: textMessage_1.TextMessage.textOnlyChangeLevel1_7Bidirectional8_10,
                                            });
                                        }
                                    }
                                    if (checkChangeDivision !== textNoChangeData ||
                                        checkChangeDepartment !== textNoChangeData) {
                                        listTextContentChangeEvaluation.push({
                                            textChange: textMessage_1.TextMessage.textTitleDepDiv,
                                            priority: 1,
                                            text: textMessage_1.TextMessage.textChangeDepDiv,
                                        });
                                    }
                                    if (isChangeFlagSkill &&
                                        flagSkill == 0) {
                                        listTextContentChangeEvaluation.push({
                                            textChange: textMessage_1.TextMessage.textTitleSkill,
                                            priority: 2,
                                            text: textMessage_1.TextMessage.textChangeHaveSkillToNotSkill,
                                        });
                                    }
                                    else if (isChangeFlagSkill &&
                                        flagSkill == 1) {
                                        listTextContentChangeEvaluation.push({
                                            textChange: textMessage_1.TextMessage.textTitleSkill,
                                            priority: 2,
                                            text: textMessage_1.TextMessage.textChangeNotSkillToHaveSkill,
                                        });
                                    }
                                }
                                else if (isChangedData &&
                                    radioResetValue == 2 &&
                                    ((levelOld < 8 &&
                                        !(0, util_1.compareDatePeriod)((_p = evaluation.evaluationPeriod) === null || _p === void 0 ? void 0 : _p.dateCreationGoalStart, (_q = evaluation.evaluationPeriod) === null || _q === void 0 ? void 0 : _q.dateCreationGoalEnd, timeZone)) ||
                                        (levelOld > 7 &&
                                            !(0, util_1.compareDatePeriod)((_r = evaluation.evaluationPeriod) === null || _r === void 0 ? void 0 : _r.dateCreationGoalDepartmentStart, (_s = evaluation.evaluationPeriod) === null || _s === void 0 ? void 0 : _s.dateCreationGoalDepartmentEnd, timeZone))) &&
                                    evaluation.status < 50) {
                                    if (checkChangeLevel !== textNoChangeData) {
                                        if (level < 8 && levelOld < 8) {
                                            listTextContentChangeEvaluation.push({
                                                priority: 1,
                                                text: textMessage_1.TextMessage.textOptional2_OnlyChangeLevel17_BeforeFix,
                                            });
                                        }
                                    }
                                    if (checkChangeLevel !== textNoChangeData) {
                                        if (level > 7 && levelOld > 7) {
                                            listTextContentChangeEvaluation.push({
                                                priority: 1,
                                                text: textMessage_1.TextMessage.textOptional2_OnlyChangeLevel810_BeforeFix,
                                            });
                                        }
                                    }
                                }
                                else if (isChangedData &&
                                    radioResetValue == 1 &&
                                    ((levelOld < 8 &&
                                        !(0, util_1.compareDatePeriod)((_t = evaluation.evaluationPeriod) === null || _t === void 0 ? void 0 : _t.dateCreationGoalStart, (_u = evaluation.evaluationPeriod) === null || _u === void 0 ? void 0 : _u.dateCreationGoalEnd, timeZone)) ||
                                        (levelOld > 7 &&
                                            !(0, util_1.compareDatePeriod)((_v = evaluation.evaluationPeriod) === null || _v === void 0 ? void 0 : _v.dateCreationGoalDepartmentStart, (_w = evaluation.evaluationPeriod) === null || _w === void 0 ? void 0 : _w.dateCreationGoalDepartmentEnd, timeZone))) &&
                                    evaluation.status < 50) {
                                    if ((checkChangeLevel !== textNoChangeData &&
                                        level < 8 &&
                                        levelOld < 8) ||
                                        (checkChangeLevel !== textNoChangeData &&
                                            level > 7 &&
                                            levelOld > 7) ||
                                        (checkChangeLevel !== textNoChangeData &&
                                            ((level >= 8 && levelOld < 8) ||
                                                (level <= 7 && levelOld > 7))) ||
                                        checkChangeDivision !== textNoChangeData ||
                                        checkChangeDepartment !== textNoChangeData ||
                                        (isChangeFlagSkill && flagSkill == 0) ||
                                        (isChangeFlagSkill && flagSkill == 1)) {
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
                                        const itemChanged = await this.getStringChangeItem(dataCheck);
                                        listTextContentChangeEvaluation.push({
                                            priority: 1,
                                            text: itemChanged +
                                                textMessage_1.TextMessage.textOptional1_ChangeAnyThing_BeforeFix,
                                        });
                                    }
                                }
                            }
                            else if (data.length == 0) {
                                const count = await this.managementUserRepository.countEvaluationByUserId(getEvaluationPeriods[0].id, [user.id], companyGroupCode);
                                let listText = [];
                                if (textChangeLevel) {
                                    listText.push({ text: textMessage_1.TextMessage.textTitleLevel });
                                }
                                if (textChangeDivision ||
                                    textChangeDepartment) {
                                    listText.push({ text: textMessage_1.TextMessage.textTitleDepDiv });
                                }
                                if (textChangeSkill) {
                                    listText.push({ text: textMessage_1.TextMessage.textTitleSkill });
                                }
                                let textChange = '';
                                if (listText.length > 0) {
                                    textChange = (_x = listText === null || listText === void 0 ? void 0 : listText.map((v) => v.text)) === null || _x === void 0 ? void 0 : _x.join('、');
                                }
                                if (count == 0) {
                                    listTextContentChangeEvaluation.push({
                                        priority: 1,
                                        text: textMessage_1.TextMessage.textItemChanged.replace('{item}', textChange.toString()) + textMessage_1.TextMessage.textNoChangeUserEvaluation,
                                    });
                                }
                                else {
                                    listTextContentChangeEvaluation.push({
                                        priority: 1,
                                        text: textMessage_1.TextMessage.textItemChanged.replace('{item}', textChange.toString()) + textMessage_1.TextMessage.textOptional1_ChangeAnyThing_AfterFix,
                                    });
                                }
                            }
                        });
                    }
                    if (listTextContentChangeEvaluation.length === 0) {
                        listTextContentChangeEvaluation.push({
                            priority: 1,
                            text: textMessage_1.TextMessage.textNoChangeUserEvaluation,
                        });
                    }
                    listResult.push({
                        fullName: user.employeeNumber + ': ' + user.fullName,
                        employeeNumber: user.employeeNumber,
                        userInforChange: textChangeCompany +
                            textChangeDivision +
                            textChangeDepartment +
                            textChangeLevel +
                            textChangeSkill,
                        userEvaluationChange: await this.handleListTextChangeUserInforEvaluation(listTextContentChangeEvaluation),
                    });
                }
            }
        });
        listResult.sort((a, b) => a.employeeNumber.localeCompare(b.employeeNumber));
        return listResult;
    }
    async historyUpdateUserList(companyGroupCode, userId) {
        return await this.userHistoryUpdateRepo.getHistoryUpdateUserList(companyGroupCode, userId);
    }
    async changeRoleUserManagement(userId, roles, companyGroupCode, isChangeRoleF2, isChangeRoleF3, isChangeRoleF4, typeChangeRoleF1, timeZone) {
        const roleChangeError = { role05: '', role1: '', role2: '' };
        const listEvaluationIds = [];
        if (roles) {
            if (isChangeRoleF2) {
                await this.processes(userId, roleChangeError, '0.5', [3, 4, 53, 54, 55], listEvaluationIds, companyGroupCode);
                await this.processes(userId, roleChangeError, '1.0', [5, 6, 56, 57, 58], listEvaluationIds, companyGroupCode);
                await this.processes(userId, roleChangeError, '2.0', [98], listEvaluationIds, companyGroupCode);
                if (roleChangeError.role05 ||
                    roleChangeError.role1 ||
                    roleChangeError.role2) {
                    return roleChangeError;
                }
            }
        }
        try {
            return await this.managementUserRepository.changeRoleUserManagement(userId, roles, companyGroupCode);
        }
        catch (error) {
            throw new RuntimeException_1.RuntimeException(error, (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateFullNameUser(userId, fullName) {
        return await this.managementUserRepository.updateFullNameUser(userId, fullName);
    }
};
__decorate([
    (0, common_1.Inject)(user_repository_1.UserRepository),
    __metadata("design:type", user_repository_1.UserRepository)
], ManagemantUserServices.prototype, "userRepo", void 0);
__decorate([
    (0, common_1.Inject)(managementUser_repository_1.ManagementUserRepository),
    __metadata("design:type", managementUser_repository_1.ManagementUserRepository)
], ManagemantUserServices.prototype, "managementUserRepository", void 0);
__decorate([
    (0, common_1.Inject)(department_repository_1.DepartmentRepository),
    __metadata("design:type", department_repository_1.DepartmentRepository)
], ManagemantUserServices.prototype, "departmentRepository", void 0);
__decorate([
    (0, common_1.Inject)(company_repository_1.CompanyRepository),
    __metadata("design:type", company_repository_1.CompanyRepository)
], ManagemantUserServices.prototype, "companyRepository", void 0);
__decorate([
    (0, common_1.Inject)(UserHistoryUpdateRepo_1.UserHistoryUpdateRepo),
    __metadata("design:type", UserHistoryUpdateRepo_1.UserHistoryUpdateRepo)
], ManagemantUserServices.prototype, "userHistoryUpdateRepo", void 0);
ManagemantUserServices = __decorate([
    (0, common_1.Injectable)()
], ManagemantUserServices);
exports.ManagemantUserServices = ManagemantUserServices;
//# sourceMappingURL=managementUser.service.js.map
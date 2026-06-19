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
exports.OracleRepository = void 0;
const common_1 = require("@nestjs/common");
const EntityConstant_1 = require("../constant/EntityConstant");
const oracledb_1 = require("./oracledb");
const testConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    externalAuth: false,
};
let OracleRepository = class OracleRepository {
    async getUserDataOracleDb(query, companyGroupCode) {
        var _a, e_1, _b, _c;
        const { offset, next, email, departmentId, company } = query;
        const deparmentName = departmentId.split(':')[1];
        const companyName = company.split(':')[1];
        const employeeNumberList = {};
        const arrEmployeeNumberList = [];
        const listUser = await this.userRepository.findAll({
            attributes: ['employeeNumber'],
            where: { active: 1, companyGroupCode: companyGroupCode },
        });
        listUser.forEach((e) => {
            employeeNumberList[`parameter${e.dataValues.employeeNumber}`] = {
                dir: this.oracleDb.BIND_IN,
                val: e.dataValues.employeeNumber,
                type: this.oracleDb.STRING,
            };
            arrEmployeeNumberList.push(`:parameter${e.dataValues.employeeNumber}`);
        });
        const connection = await this.oracleDb.getConnection(testConfig);
        try {
            const results = await connection.execute((0, oracledb_1.getUserDbOracle)(arrEmployeeNumberList), this.paramGetDataOracle(email, deparmentName === 'すべて' ? undefined : deparmentName, employeeNumberList, offset, next, '従業員コード', 'ASC', companyName));
            const users = [];
            if (results) {
                let no = 0;
                try {
                    for (var _d = true, _e = __asyncValues(results.rows), _f; _f = await _e.next(), _a = _f.done, !_a;) {
                        _c = _f.value;
                        _d = false;
                        try {
                            const rowData = _c;
                            no++;
                            const { USERNAME, 姓, 名, DEPARTMENTID, DEPARTMENTNAME, POSITIONID, POSITION, POSITIONNAME, COMPANYID, COMPANY, 従業員コード, } = rowData;
                            const itemUser = {
                                key: (従業員コード === null || 従業員コード === void 0 ? void 0 : 従業員コード.trim()) + no,
                                username: USERNAME === null || USERNAME === void 0 ? void 0 : USERNAME.trim(),
                                fullName: (姓 === null || 姓 === void 0 ? void 0 : 姓.trim()) + ' ' + (名 || '').trim(),
                                department: DEPARTMENTNAME === null || DEPARTMENTNAME === void 0 ? void 0 : DEPARTMENTNAME.trim(),
                                departmentId: DEPARTMENTID === null || DEPARTMENTID === void 0 ? void 0 : DEPARTMENTID.trim(),
                                positionId: POSITIONID === null || POSITIONID === void 0 ? void 0 : POSITIONID.trim(),
                                position: POSITION === null || POSITION === void 0 ? void 0 : POSITION.trim(),
                                companyId: COMPANYID === null || COMPANYID === void 0 ? void 0 : COMPANYID.trim(),
                                company: COMPANY === null || COMPANY === void 0 ? void 0 : COMPANY.trim(),
                                email: (USERNAME === null || USERNAME === void 0 ? void 0 : USERNAME.trim()) + '@geonet.co.jp',
                                employeeNumber: 従業員コード === null || 従業員コード === void 0 ? void 0 : 従業員コード.trim(),
                            };
                            users.push(itemUser);
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            const total = await connection.execute((0, oracledb_1.countUserDB)(arrEmployeeNumberList), this.countParamOracle(email, deparmentName === 'すべて' ? undefined : deparmentName, companyName, employeeNumberList));
            return { data: users, total: total.rows[0].TOTAL };
        }
        catch (err) {
            console.log(err);
        }
        finally {
            connection.release();
        }
    }
    async getDepartment() {
        var _a, e_2, _b, _c;
        const connection = await this.oracleDb.getConnection(testConfig);
        try {
            const results = await connection.execute(oracledb_1.getDepartment);
            if (results) {
                const deparments = [];
                if (results) {
                    try {
                        for (var _d = true, _e = __asyncValues(results.rows), _f; _f = await _e.next(), _a = _f.done, !_a;) {
                            _c = _f.value;
                            _d = false;
                            try {
                                const rowData = _c;
                                const { 拠点コード, 拠点名, } = rowData;
                                const itemDepartment = {
                                    departmentId: 拠点コード === null || 拠点コード === void 0 ? void 0 : 拠点コード.trim(),
                                    departmentName: 拠点名 === null || 拠点名 === void 0 ? void 0 : 拠点名.trim(),
                                };
                                deparments.push(itemDepartment);
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                return deparments;
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            connection.release();
        }
    }
    async getCompany() {
        var _a, e_3, _b, _c;
        const connection = await this.oracleDb.getConnection(testConfig);
        try {
            const results = await connection.execute(oracledb_1.getCompany);
            if (results) {
                const companys = [];
                if (results) {
                    try {
                        for (var _d = true, _e = __asyncValues(results.rows), _f; _f = await _e.next(), _a = _f.done, !_a;) {
                            _c = _f.value;
                            _d = false;
                            try {
                                const rowData = _c;
                                const { COMPANYID, COMPANY, } = rowData;
                                const itemCompany = {
                                    conpanyId: COMPANYID === null || COMPANYID === void 0 ? void 0 : COMPANYID.trim(),
                                    companyName: COMPANY === null || COMPANY === void 0 ? void 0 : COMPANY.trim(),
                                };
                                companys.push(itemCompany);
                            }
                            finally {
                                _d = true;
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
                return companys;
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            connection.release();
        }
    }
    async getUserActive(id) {
        return await this.userRepository.findOne({
            where: { id, active: 1 },
        });
    }
    countParamOracle(email, departmentName, company, existingEmploymentNumberList) {
        return Object.assign({ email: {
                dir: this.oracleDb.BIND_IN,
                val: `%${email || ''}%`,
                type: this.oracleDb.STRING,
            }, departmentName: {
                dir: this.oracleDb.BIND_IN,
                val: `%${departmentName || ''}%`,
                type: this.oracleDb.STRING,
            }, company: {
                dir: this.oracleDb.BIND_IN,
                val: `%${company || ''}%`,
                type: this.oracleDb.STRING,
            } }, existingEmploymentNumberList);
    }
    paramGetDataOracle(email, departmentName, existingEmailList, offset, next, sortKey, sortOrder, company) {
        return Object.assign({ email: {
                dir: this.oracleDb.BIND_IN,
                val: `%${email || ''}%`,
                type: this.oracleDb.STRING,
            }, departmentName: {
                dir: this.oracleDb.BIND_IN,
                val: `%${departmentName || ''}%`,
                type: this.oracleDb.STRING,
            }, offsetParam: {
                dir: this.oracleDb.BIND_IN,
                val: offset === null || offset === void 0 ? void 0 : offset.toString(),
                type: this.oracleDb.STRING,
            }, nextParam: {
                dir: this.oracleDb.BIND_IN,
                val: (next === null || next === void 0 ? void 0 : next.toString()) || '20',
                type: this.oracleDb.STRING,
            }, sortKey: {
                dir: this.oracleDb.BIND_IN,
                val: `${sortKey || ''}`,
                type: this.oracleDb.STRING,
            }, sortOrder: {
                dir: this.oracleDb.BIND_IN,
                val: `${sortOrder || 'ASC'}`,
                type: this.oracleDb.STRING,
            }, company: {
                dir: this.oracleDb.BIND_IN,
                val: `%${company || ''}%`,
                type: this.oracleDb.STRING,
            } }, existingEmailList);
    }
};
__decorate([
    (0, common_1.Inject)(EntityConstant_1.default.USER),
    __metadata("design:type", Object)
], OracleRepository.prototype, "userRepository", void 0);
__decorate([
    (0, common_1.Inject)('ORACLE'),
    __metadata("design:type", Object)
], OracleRepository.prototype, "oracleDb", void 0);
OracleRepository = __decorate([
    (0, common_1.Injectable)()
], OracleRepository);
exports.OracleRepository = OracleRepository;
//# sourceMappingURL=oracle.repository.js.map
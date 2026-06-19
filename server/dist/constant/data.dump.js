"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpData = void 0;
const Company_1 = require("../entity/Company");
const Department_1 = require("../entity/Department");
const Role_1 = require("../entity/Role");
const User_1 = require("../entity/User");
const Roles_1 = require("../enum/Roles");
const RoleName_1 = require("./RoleName");
const dumpData = async () => {
    const roles = [
        { name: RoleName_1.RoleName[Roles_1.Roles.F1], id: Roles_1.Roles.F1 },
        { name: RoleName_1.RoleName[Roles_1.Roles.F2], id: Roles_1.Roles.F2 },
        { name: RoleName_1.RoleName[Roles_1.Roles.F3], id: Roles_1.Roles.F3 },
        { name: RoleName_1.RoleName[Roles_1.Roles.F4], id: Roles_1.Roles.F4 },
        { name: RoleName_1.RoleName[Roles_1.Roles.F5], id: Roles_1.Roles.F5 },
        { name: RoleName_1.RoleName[Roles_1.Roles.F6], id: Roles_1.Roles.F6 },
        { name: RoleName_1.RoleName[Roles_1.Roles.F7], id: Roles_1.Roles.F7 },
        { name: RoleName_1.RoleName[Roles_1.Roles.F8], id: Roles_1.Roles.F8 },
    ];
    await Role_1.Role.bulkCreate(roles, { ignoreDuplicates: true });
    await Department_1.Department.findOrCreate({
        defaults: {
            code: '16738',
            name: 'ﾍﾞﾄﾅﾑ開発課',
            class: 0,
            type: 0,
            active: 1,
        },
        where: { code: '16738' },
    });
    await Company_1.Company.findOrCreate({
        defaults: { name: '株式会社ゲオホールディングス' },
        where: { name: '株式会社ゲオホールディングス' },
    });
    await User_1.User.findOrCreate({
        defaults: {
            fullName: 'ベトナム システム',
            email: 'vietnam.system@geonet.co.jp',
            departmentId: 1,
            companyId: 1,
            level: 1,
            employeeNumber: 2004045,
            active: 1,
        },
        where: { email: 'vietnam.system@geonet.co.jp' },
    }).then(([data, _isCreate]) => {
        data.setRoles([1, 2, 3, 4, 5, 6, 7, 8]);
    });
};
exports.dumpData = dumpData;
//# sourceMappingURL=data.dump.js.map
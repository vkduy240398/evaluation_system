"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oracleConfig = void 0;
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
exports.oracleConfig = {
    provide: 'ORACLE',
    useFactory: () => {
        return oracledb;
    },
};
//# sourceMappingURL=OracleConfig.js.map
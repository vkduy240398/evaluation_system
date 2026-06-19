// eslint-disable-next-line @typescript-eslint/no-var-requires
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export const oracleConfig = {
  provide: 'ORACLE',
  useFactory: () => {
    return oracledb;
  },
};

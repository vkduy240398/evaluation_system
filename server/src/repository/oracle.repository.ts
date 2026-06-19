import { Inject, Injectable } from '@nestjs/common';
import EntityConstant from 'src/constant/EntityConstant';
import { User } from 'src/entity/User';
import { OracleRepositoryI } from 'src/interfaces/repository/oracle.repository.interface';
import {
  getDepartment,
  getCompany,
  getUserDbOracle,
  countUserDB,
} from './oracledb';
import { GetUserDataOracleDto } from 'src/model/getUserDataOracleDto';
import oracledb from 'oracledb';
const testConfig: oracledb.PoolAttributes = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
  externalAuth: false,
};

@Injectable()
export class OracleRepository implements OracleRepositoryI {
  @Inject(EntityConstant.USER)
  private userRepository: typeof User;
  @Inject('ORACLE')
  private oracleDb: any;

  async getUserDataOracleDb(
    query: GetUserDataOracleDto,
    companyGroupCode: string,
  ) {
    const { offset, next, email, departmentId, company } = query;
    const deparmentName = departmentId.split(':')[1];
    const companyName = company.split(':')[1];
    const employeeNumberList: any = {};
    const arrEmployeeNumberList: string[] = [];
    const listUser: any = await this.userRepository.findAll({
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
      const results = await connection.execute(
        getUserDbOracle(arrEmployeeNumberList),
        this.paramGetDataOracle(
          email,
          deparmentName === 'すべて' ? undefined : deparmentName,
          employeeNumberList,
          offset,
          next,
          '従業員コード',
          'ASC',
          companyName,
        ),
      );
      const users: any[] = [];
      if (results) {
        let no = 0;
        for await (const rowData of results.rows as any) {
          no++;
          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            USERNAME,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            姓,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            名,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            DEPARTMENTID,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            DEPARTMENTNAME,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            POSITIONID,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            POSITION,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            POSITIONNAME,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            COMPANYID,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            COMPANY,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            従業員コード,
          } = rowData;
          const itemUser = {
            key: 従業員コード?.trim() + no,
            username: USERNAME?.trim(),
            fullName: 姓?.trim() + ' ' + (名 || '').trim(),
            department: DEPARTMENTNAME?.trim(),
            departmentId: DEPARTMENTID?.trim(),
            positionId: POSITIONID?.trim(),
            position: POSITION?.trim(),
            companyId: COMPANYID?.trim(),
            company: COMPANY?.trim(),
            email: USERNAME?.trim() + '@geonet.co.jp',
            employeeNumber: 従業員コード?.trim(),
          };
          users.push(itemUser);
        }
      }
      const total = await connection.execute(
        countUserDB(arrEmployeeNumberList),
        this.countParamOracle(
          email,
          deparmentName === 'すべて' ? undefined : deparmentName,
          companyName,
          employeeNumberList,
        ),
      );

      return { data: users, total: total.rows[0].TOTAL };
    } catch (err) {
      console.log(err);
    } finally {
      connection.release();
    }
  }
  async getDepartment() {
    const connection = await this.oracleDb.getConnection(testConfig);
    try {
      const results = await connection.execute(getDepartment);
      if (results) {
        const deparments: any[] = [];
        if (results) {
          for await (const rowData of results.rows as any) {
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              拠点コード,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              拠点名,
            } = rowData;
            const itemDepartment = {
              departmentId: 拠点コード?.trim(),
              departmentName: 拠点名?.trim(),
            };
            deparments.push(itemDepartment);
          }
        }
        return deparments;
      }
    } catch (err) {
      console.log(err);
    } finally {
      connection.release();
    }
  }
  async getCompany() {
    const connection = await this.oracleDb.getConnection(testConfig);
    try {
      const results = await connection.execute(getCompany);
      if (results) {
        const companys: any[] = [];
        if (results) {
          for await (const rowData of results.rows as any) {
            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              COMPANYID,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              COMPANY,
            } = rowData;
            const itemCompany = {
              conpanyId: COMPANYID?.trim(),
              companyName: COMPANY?.trim(),
            };
            companys.push(itemCompany);
          }
        }
        return companys;
      }
    } catch (err) {
      console.log(err);
    } finally {
      connection.release();
    }
  }
  async getUserActive(id: number) {
    return await this.userRepository.findOne({
      where: { id, active: 1 },
    });
  }
  private countParamOracle(
    email: any | undefined | null,
    departmentName: string | null | undefined,
    company: string | null | undefined,
    existingEmploymentNumberList: any | null | undefined,
  ) {
    return {
      email: {
        dir: this.oracleDb.BIND_IN,
        val: `%${email || ''}%`,
        type: this.oracleDb.STRING,
      },
      departmentName: {
        dir: this.oracleDb.BIND_IN,
        val: `%${departmentName || ''}%`,
        type: this.oracleDb.STRING,
      },
      company: {
        dir: this.oracleDb.BIND_IN,
        val: `%${company || ''}%`,
        type: this.oracleDb.STRING,
      },
      ...existingEmploymentNumberList,
    };
  }
  private paramGetDataOracle(
    email: string | null | undefined,
    departmentName: string | null | undefined,
    existingEmailList: any | null | undefined,
    offset: number | null | undefined,
    next: number | null | undefined,
    sortKey: any | null | undefined,
    sortOrder: any | null | undefined,
    company: string | null | undefined,
  ) {
    return {
      email: {
        dir: this.oracleDb.BIND_IN,
        val: `%${email || ''}%`,
        type: this.oracleDb.STRING,
      },
      departmentName: {
        dir: this.oracleDb.BIND_IN,
        val: `%${departmentName || ''}%`,
        type: this.oracleDb.STRING,
      },
      offsetParam: {
        dir: this.oracleDb.BIND_IN,
        val: offset?.toString(),
        type: this.oracleDb.STRING,
      },
      nextParam: {
        dir: this.oracleDb.BIND_IN,
        val: next?.toString() || '20',
        type: this.oracleDb.STRING,
      },
      sortKey: {
        dir: this.oracleDb.BIND_IN,
        val: `${sortKey || ''}`,
        type: this.oracleDb.STRING,
      },
      sortOrder: {
        dir: this.oracleDb.BIND_IN,
        val: `${sortOrder || 'ASC'}`,
        type: this.oracleDb.STRING,
      },
      company: {
        dir: this.oracleDb.BIND_IN,
        val: `%${company || ''}%`,
        type: this.oracleDb.STRING,
      },
      ...existingEmailList,
    };
  }
}

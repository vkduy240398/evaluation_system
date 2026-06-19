// src/excel/excel.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { fork } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { AdminEvaluationServiceI } from 'src/interfaces/service/adminEvaluation.service.interface';
import { AdminEvaluationService } from './adminEvaluation.service';
import { resolve } from 'path';

const jobMap = new Map();

const messageMap = new Map();

@Injectable()
export class ExcelService {
  @Inject(AdminEvaluationService)
  private adminEvaluationService: AdminEvaluationServiceI;

  async createJob(query: any, req: any): Promise<string> {
    const jobId = Date.now().toString(); // Hoặc dùng uuid
    const isDev = process.env.NODE_ENV !== 'production';

    const departments: any = query.departmentSearch;

    const salaryRanks: any = query.salaryRank.split(',');

    const param = {
      email: query.email || '',
      department: departments,
      salaryRank: salaryRanks,
      year: query.year,
      periodIndex: query.periodEvaluate,
      status: query.status !== '' ? query.status.split(',') : [],
    };

    const datas = await this.adminEvaluationService.getDataExcel(
      param,
      req.user.companyGroupCode,
      req['user'].timeZone,
    );
    const year = query.year;
    const periodIndex = query.periodEvaluate;
    const timezone = req['user'].timeZone;

    const child = isDev
      ? fork(path.join(__dirname, '../../src/excel/excel.woker.ts'), [], {
          execArgv: ['-r', 'ts-node/register'],
        })
      : fork(resolve(__dirname, '..', `excel/excel.woker.js`));

    child.send({ jobId, datas, year, periodIndex, timezone });

    // Optional: lắng nghe kết quả nếu bạn muốn log, lưu trạng thái vào DB, etc.
    child.on('message', (msg: any) => {
      if (msg.type === 'progress') {
        jobMap.set(jobId, msg.percent);
        messageMap.set(jobId, msg.file);
      }
      if (msg.success) {
        console.log(`Excel job ${msg.jobId} completed`);
      }
    });

    return jobId;
  }

  getFilePath(jobId: string): string {
    return path.join(__dirname, '../../jobs', `temp-${jobId}.zip`);
  }

  isJobReady(jobId: string): boolean {
    return fs.existsSync(this.getFilePath(jobId));
  }

  percentJob(jobId: string): number {
    return jobMap.get(jobId) ?? 0;
  }
  messsageJob(jobId: string): string {
    return messageMap.get(jobId);
  }
}

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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path = require("path");
const fs = require("fs");
const adminEvaluation_service_1 = require("./adminEvaluation.service");
const path_1 = require("path");
const jobMap = new Map();
const messageMap = new Map();
let ExcelService = class ExcelService {
    async createJob(query, req) {
        const jobId = Date.now().toString();
        const isDev = process.env.NODE_ENV !== 'production';
        const departments = query.departmentSearch;
        const salaryRanks = query.salaryRank.split(',');
        const param = {
            email: query.email || '',
            department: departments,
            salaryRank: salaryRanks,
            year: query.year,
            periodIndex: query.periodEvaluate,
            status: query.status !== '' ? query.status.split(',') : [],
        };
        const datas = await this.adminEvaluationService.getDataExcel(param, req.user.companyGroupCode, req['user'].timeZone);
        const year = query.year;
        const periodIndex = query.periodEvaluate;
        const timezone = req['user'].timeZone;
        const child = isDev
            ? (0, child_process_1.fork)(path.join(__dirname, '../../src/excel/excel.woker.ts'), [], {
                execArgv: ['-r', 'ts-node/register'],
            })
            : (0, child_process_1.fork)((0, path_1.resolve)(__dirname, '..', `excel/excel.woker.js`));
        child.send({ jobId, datas, year, periodIndex, timezone });
        child.on('message', (msg) => {
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
    getFilePath(jobId) {
        return path.join(__dirname, '../../jobs', `temp-${jobId}.zip`);
    }
    isJobReady(jobId) {
        return fs.existsSync(this.getFilePath(jobId));
    }
    percentJob(jobId) {
        var _a;
        return (_a = jobMap.get(jobId)) !== null && _a !== void 0 ? _a : 0;
    }
    messsageJob(jobId) {
        return messageMap.get(jobId);
    }
};
__decorate([
    (0, common_1.Inject)(adminEvaluation_service_1.AdminEvaluationService),
    __metadata("design:type", Object)
], ExcelService.prototype, "adminEvaluationService", void 0);
ExcelService = __decorate([
    (0, common_1.Injectable)()
], ExcelService);
exports.ExcelService = ExcelService;
//# sourceMappingURL=excel.service.js.map
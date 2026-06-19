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
exports.ManualService = void 0;
const common_1 = require("@nestjs/common");
const ManualType_1 = require("../enum/ManualType");
const path_1 = require("path");
const RuntimeException_1 = require("../model/exception/RuntimeException");
const config_1 = require("@nestjs/config");
const ManualResponseDto_1 = require("../model/response/ManualResponseDto");
const Roles_1 = require("../enum/Roles");
let ManualService = class ManualService {
    constructor(configService) {
        this.configService = configService;
    }
    async getManualFile(type, req) {
        var _a, _b;
        const fs = require('fs');
        const manualNameF12 = this.configService.get('MANUAL_NAME_F12');
        const manualNameF34 = this.configService.get('MANUAL_NAME_F34');
        const manualNameF5678 = this.configService.get('MANUAL_NAME_F5678');
        const listTypeNames = ['', manualNameF12, manualNameF34, manualNameF5678];
        try {
            const filename = listTypeNames[Number(type)];
            const response = new ManualResponseDto_1.ManualResponseDto();
            const isExistFileCompany = fs.existsSync((0, path_1.resolve)(__dirname, '..', `pdf/${(_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.companyGroupCode}/${filename}`));
            const buffer = isExistFileCompany
                ? fs.readFileSync((0, path_1.resolve)(__dirname, '..', `pdf/${(_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.companyGroupCode}/${filename}`))
                : fs.readFileSync((0, path_1.resolve)(__dirname, '..', `pdf/${filename}`));
            response.file = buffer;
            response.filename = filename;
            return response;
        }
        catch (err) {
            const NODE_ENV = this.configService.get('NODE_ENV');
            if (NODE_ENV !== 'production') {
                console.log(err);
            }
            throw new RuntimeException_1.RuntimeException(err, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    checkPermissionManualFile(type, req) {
        var _a;
        const listUserRole = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.roles;
        if (type === ManualType_1.ManualType.F12 &&
            (listUserRole === null || listUserRole === void 0 ? void 0 : listUserRole.some((obj) => obj === Roles_1.Roles.F1 || obj === Roles_1.Roles.F2))) {
            return true;
        }
        else if (type === ManualType_1.ManualType.F34 &&
            (listUserRole === null || listUserRole === void 0 ? void 0 : listUserRole.some((obj) => obj === Roles_1.Roles.F3 || obj === Roles_1.Roles.F4))) {
            return true;
        }
        else if (type === ManualType_1.ManualType.F5678 &&
            (listUserRole === null || listUserRole === void 0 ? void 0 : listUserRole.some((obj) => obj === Roles_1.Roles.F5 ||
                obj === Roles_1.Roles.F6 ||
                obj === Roles_1.Roles.F7 ||
                obj === Roles_1.Roles.F8))) {
            return true;
        }
        else {
            return false;
        }
    }
};
ManualService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ManualService);
exports.ManualService = ManualService;
//# sourceMappingURL=manual.service.js.map
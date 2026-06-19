"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerModule = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../services/logger.service");
const log4js_1 = require("log4js");
const config = {
    "appenders": {
        "everything": {
            "type": "dateFile",
            "pattern": 'yyyyMMdd',
            "keepFileExt": true,
            "filename": "logs/access.log",
            "daysToKeep": 400,
            "maxLogSize": 1048576,
            "category": "access",
            "alwaysIncludePattern": true,
            "layout": {
                "type": "pattern",
                "pattern": "%d [%p] %m"
            }
        },
    },
    "pm2": true,
    "disableClustering": true,
    "categories": {
        "default": {
            "appenders": ["everything"],
            "level": "all"
        }
    }
};
const loggerFactory = {
    provide: logger_service_1.CustomLogger,
    useFactory: () => {
        (0, log4js_1.configure)(config);
        return new logger_service_1.CustomLogger((0, log4js_1.getLogger)("default"));
    }
};
let LoggerModule = class LoggerModule {
};
LoggerModule = __decorate([
    (0, common_1.Module)({
        providers: [loggerFactory],
        exports: [loggerFactory]
    })
], LoggerModule);
exports.LoggerModule = LoggerModule;
//# sourceMappingURL=LoggerConfig.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
class CustomLogger {
    constructor(logger) {
        this.logger = logger;
    }
    log(req, content) {
        var _a, _b, _c;
        if (!req) {
            this.logger.info(`${content}`);
        }
        else if (req.originalUrl === '/api/v1/auth/login' ||
            ((req === null || req === void 0 ? void 0 : req.user) && ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id))) {
            this.logger.info(`[${req.header('x-forwarded-for') || req.ip.split(':').pop()}] [${(req === null || req === void 0 ? void 0 : req.user) && ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) ? (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id : ''}] ${req.method}: ${req.originalUrl}${req.body && Object.keys(req.body).length !== 0
                ? ' - ' + JSON.stringify(req.body)
                : ''} - ${content}`);
        }
    }
    error(req, content) {
        var _a, _b, _c;
        if (!req) {
            this.logger.error(`${content}`);
        }
        else if (req.originalUrl === '/api/v1/auth/login' ||
            ((req === null || req === void 0 ? void 0 : req.user) && ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id))) {
            this.logger.error(`[${req.header('x-forwarded-for') || req.ip.split(':').pop()}] [${(req === null || req === void 0 ? void 0 : req.user) && ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) ? (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id : ''}] ${req.method}: ${req.originalUrl}${req.body && Object.keys(req.body).length !== 0
                ? ' - ' + JSON.stringify(req.body)
                : ''} - ${content}`);
        }
    }
    warn(req, content) {
        var _a, _b, _c;
        if (!req) {
            this.logger.warn(`${content}`);
        }
        else if (req.originalUrl === '/api/v1/auth/login' ||
            ((req === null || req === void 0 ? void 0 : req.user) && ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id))) {
            this.logger.warn(`[${req.header('x-forwarded-for') || req.ip.split(':').pop()}] [${(req === null || req === void 0 ? void 0 : req.user) && ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) ? (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id : ''}] ${req.method}: ${req.originalUrl}${req.body && Object.keys(req.body).length !== 0
                ? ' - ' + JSON.stringify(req.body)
                : ''} - ${content}`);
        }
    }
    debug(req, content) {
        var _a, _b, _c;
        if (!req) {
            this.logger.debug(`${content}`);
        }
        else if (req.originalUrl === '/api/v1/auth/login' ||
            ((req === null || req === void 0 ? void 0 : req.user) && ((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id))) {
            this.logger.debug(`[${req.header('x-forwarded-for') || req.ip.split(':').pop()}] [${(req === null || req === void 0 ? void 0 : req.user) && ((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.id) ? (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id : ''}] ${req.method}: ${req.originalUrl}${req.body && Object.keys(req.body).length !== 0
                ? ' - ' + JSON.stringify(req.body)
                : ''} - ${content}`);
        }
    }
}
exports.CustomLogger = CustomLogger;
//# sourceMappingURL=logger.service.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.ServiceModule = exports.RepositoryModule = exports.ConfigAppModule = exports.EntityModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const LoggerMiddleware_1 = require("../handler/middleware/LoggerMiddleware");
const SequelizeConfig_1 = require("./SequelizeConfig");
const nestjs_dynamic_providers_1 = require("nestjs-dynamic-providers");
const nestjs_autoloader_1 = require("nestjs-autoloader");
const path_1 = require("path");
const jwt_1 = require("@nestjs/jwt");
const EntityExport_1 = require("../entity/EntityExport");
const auth_guard_1 = require("../handler/guard/auth.guard");
const local_strategy_1 = require("../strategies/local.strategy");
const jwt_strategy_1 = require("../strategies/jwt.strategy");
const role_guard_1 = require("../handler/guard/role.guard");
const OracleConfig_1 = require("./OracleConfig");
const schedule_1 = require("@nestjs/schedule");
const LoggerConfig_1 = require("./LoggerConfig");
const cache_manager_1 = require("@nestjs/cache-manager");
const RateLimitMiddleware_1 = require("../handler/middleware/RateLimitMiddleware");
const config_1 = require("@nestjs/config");
const authVietnamSystem_guard_1 = require("../handler/guard/authVietnamSystem.guard");
const configProviders = [SequelizeConfig_1.sequelizeConfig, OracleConfig_1.oracleConfig];
let EntityModule = class EntityModule {
};
EntityModule = __decorate([
    (0, common_1.Module)({
        providers: EntityExport_1.ENTITY_MODULES,
        exports: EntityExport_1.ENTITY_MODULES,
    })
], EntityModule);
exports.EntityModule = EntityModule;
let ConfigAppModule = class ConfigAppModule {
};
ConfigAppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [config_1.ConfigService, ...configProviders],
        exports: configProviders,
    })
], ConfigAppModule);
exports.ConfigAppModule = ConfigAppModule;
let RepositoryModule = class RepositoryModule {
};
RepositoryModule = __decorate([
    (0, nestjs_dynamic_providers_1.InjectDynamicProviders)({
        pattern: 'dist/repository/**/*.js',
        exportProviders: true,
    }),
    (0, common_1.Module)({
        imports: [ConfigAppModule, EntityModule],
    })
], RepositoryModule);
exports.RepositoryModule = RepositoryModule;
let ServiceModule = class ServiceModule {
};
ServiceModule = __decorate([
    (0, nestjs_dynamic_providers_1.InjectDynamicProviders)({
        pattern: 'dist/services/**/*.js',
        exportProviders: true,
    }),
    (0, common_1.Module)({
        imports: [
            RepositoryModule,
            LoggerConfig_1.LoggerModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({}),
            cache_manager_1.CacheModule.register({ ttl: 300000, isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
        ],
    })
], ServiceModule);
exports.ServiceModule = ServiceModule;
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(LoggerMiddleware_1.LoggerMiddleware).forRoutes('/');
        consumer.apply(RateLimitMiddleware_1.RateLimitMiddleware).forRoutes('/v1/auth/login');
    }
};
AppModule = __decorate([
    (0, nestjs_autoloader_1.AutoloadModule)((0, path_1.resolve)(__dirname, '..', 'controllers'), {
        imports: [
            ServiceModule,
            LoggerConfig_1.LoggerModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
        ],
        providers: [
            auth_guard_1.JwtAuthGuard,
            local_strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            schedule_1.SchedulerRegistry,
            { provide: 'APP_GUARD', useClass: role_guard_1.RolesGuard },
            authVietnamSystem_guard_1.AuthVietNamSystemGuard,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=AppModule.js.map
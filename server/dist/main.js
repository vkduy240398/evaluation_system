"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const helmet_1 = require("helmet");
const AppModule_1 = require("./config/AppModule");
const HttpExceptionFilter_1 = require("./handler/filter/HttpExceptionFilter");
const RuntimeExceptionFilter_1 = require("./handler/filter/RuntimeExceptionFilter");
const LoggingInterceptor_1 = require("./handler/interceptor/LoggingInterceptor ");
const TimeoutInterceptor_1 = require("./handler/interceptor/TimeoutInterceptor");
const nestjs_dynamic_providers_1 = require("nestjs-dynamic-providers");
const common_1 = require("@nestjs/common");
const SwaggerConfig_1 = require("./config/SwaggerConfig");
const cookieParser = require("cookie-parser");
const logger_service_1 = require("./services/logger.service");
const ExceptionHandlerFilter_1 = require("./handler/filter/ExceptionHandlerFilter");
const express_1 = require("express");
const compression = require("compression");
const pg = require('pg');
pg.types.setTypeParser(pg.types.builtins.INT8, (value) => {
    return parseInt(value);
});
const PORT = process.env.PORT;
const GLOBAL_PREFIX_ROUTE = process.env.GLOBAL_PREFIX_ROUTE;
const isAllowYaml = process.env.NODE_ENV === 'development' ? true : false;
async function bootstrap() {
    await (0, nestjs_dynamic_providers_1.resolveDynamicProviders)();
    const app = await core_1.NestFactory.create(AppModule_1.AppModule, {
        abortOnError: false,
    });
    app.enableCors({
        origin: process.env.HOSTNAME_ || 'http://localhost:4200',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.use(compression());
    app.use((0, helmet_1.default)());
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use((0, express_1.urlencoded)({ limit: '50mb', extended: true }));
    app.useGlobalFilters(new RuntimeExceptionFilter_1.RuntimeExceptionFilter(app.get(logger_service_1.CustomLogger)), new HttpExceptionFilter_1.HttpExceptionFilter(app.get(logger_service_1.CustomLogger)), new ExceptionHandlerFilter_1.ExceptionHandlerFilter(app.get(logger_service_1.CustomLogger)));
    app.use(cookieParser('secret'));
    app.useGlobalInterceptors(new LoggingInterceptor_1.LoggingInterceptor(app.get(logger_service_1.CustomLogger)), new TimeoutInterceptor_1.TimeoutInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.setGlobalPrefix(GLOBAL_PREFIX_ROUTE);
    SwaggerConfig_1.SwaggerAPI.setup(app, isAllowYaml);
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map
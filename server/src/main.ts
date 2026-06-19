import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './config/AppModule';
import { HttpExceptionFilter } from './handler/filter/HttpExceptionFilter';
import { RuntimeExceptionFilter } from './handler/filter/RuntimeExceptionFilter';
import { LoggingInterceptor } from './handler/interceptor/LoggingInterceptor ';
import { TimeoutInterceptor } from './handler/interceptor/TimeoutInterceptor';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { SwaggerAPI } from './config/SwaggerConfig';
import * as cookieParser from 'cookie-parser';
import { CustomLogger } from './services/logger.service';
import { ExceptionHandlerFilter } from './handler/filter/ExceptionHandlerFilter';
import { json, urlencoded } from 'express';
import * as compression from 'compression';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pg = require('pg');
pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
  return parseInt(value);
});

const PORT = process.env.PORT;
const GLOBAL_PREFIX_ROUTE = process.env.GLOBAL_PREFIX_ROUTE;
const isAllowYaml = process.env.NODE_ENV === 'development' ? true : false;

async function bootstrap() {
  await resolveDynamicProviders();
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });
  // const app = await NestFactory.create<NestExpressApplication>(AppModule); // you don't need to specify a type unless you actually want to access the underlying platform API
  app.enableCors({
    origin: process.env.HOSTNAME_ || 'http://localhost:4200',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    // maxAge: 1800,
  });

  app.use(compression());
  app.use(helmet());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useGlobalFilters(
    new RuntimeExceptionFilter(app.get(CustomLogger)),
    new HttpExceptionFilter(app.get(CustomLogger)),
    new ExceptionHandlerFilter(app.get(CustomLogger)),
  );
  app.use(cookieParser('secret'));

  app.useGlobalInterceptors(
    new LoggingInterceptor(app.get(CustomLogger)),
    new TimeoutInterceptor(),
  );
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     exceptionFactory: (errors) => {
  //       console.error('🚨 Validation Error:', JSON.stringify(errors, null, 2));
  //       return new BadRequestException(
  //         errors.map((err) => ({
  //           field: err.property,
  //           errors: Object.values(err.constraints || {}),
  //         })),
  //       );
  //     },
  //   }),
  // );
  app.setGlobalPrefix(GLOBAL_PREFIX_ROUTE);

  SwaggerAPI.setup(app, isAllowYaml);
  await app.listen(PORT);

  // ===============
}
bootstrap();

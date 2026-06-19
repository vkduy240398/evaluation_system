import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LoggerMiddleware } from '../handler/middleware/LoggerMiddleware';
import { sequelizeConfig } from './SequelizeConfig';
import { InjectDynamicProviders } from 'nestjs-dynamic-providers';
import { AutoloadModule } from 'nestjs-autoloader';
import { resolve } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { ENTITY_MODULES } from 'src/entity/EntityExport';
import { JwtAuthGuard } from 'src/handler/guard/auth.guard';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { RolesGuard } from 'src/handler/guard/role.guard';
import { oracleConfig } from './OracleConfig';
import { SchedulerRegistry, ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'src/config/LoggerConfig';
import { CacheModule } from '@nestjs/cache-manager';
import { RateLimitMiddleware } from 'src/handler/middleware/RateLimitMiddleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthVietNamSystemGuard } from 'src/handler/guard/authVietnamSystem.guard';

const configProviders: Provider<any>[] = [sequelizeConfig, oracleConfig];

@Module({
  providers: ENTITY_MODULES,
  exports: ENTITY_MODULES,
})
export class EntityModule {}

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, ...configProviders],
  exports: configProviders,
})
export class ConfigAppModule {}

@InjectDynamicProviders({
  pattern: 'dist/repository/**/*.js',
  exportProviders: true,
})
@Module({
  imports: [ConfigAppModule, EntityModule],
})
export class RepositoryModule {}

@InjectDynamicProviders({
  pattern: 'dist/services/**/*.js',
  exportProviders: true,
})
@Module({
  imports: [
    RepositoryModule,
    LoggerModule,
    PassportModule,
    JwtModule.register({}),
    CacheModule.register({ ttl: 300000, isGlobal: true }),
    ScheduleModule.forRoot(),
  ],
})
export class ServiceModule {}

@AutoloadModule(resolve(__dirname, '..', 'controllers'), {
  imports: [
    ServiceModule,
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [
    JwtAuthGuard,
    LocalStrategy,
    JwtStrategy,
    SchedulerRegistry,
    { provide: 'APP_GUARD', useClass: RolesGuard },
    AuthVietNamSystemGuard,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('/');
    consumer.apply(RateLimitMiddleware).forRoutes('/v1/auth/login');
  }
}

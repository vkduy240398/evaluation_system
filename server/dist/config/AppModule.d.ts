import { MiddlewareConsumer, NestModule } from '@nestjs/common';
export declare class EntityModule {
}
export declare class ConfigAppModule {
}
export declare class RepositoryModule {
}
export declare class ServiceModule {
}
export declare class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}

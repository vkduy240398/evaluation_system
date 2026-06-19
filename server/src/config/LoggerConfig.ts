import { Module } from "@nestjs/common";
import { CustomLogger } from '../services/logger.service';
import { configure, getLogger } from 'log4js';

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
}

const loggerFactory = {
    provide: CustomLogger,
    useFactory: () => {
        configure(config);
        return new CustomLogger(getLogger("default"));
    }
}

@Module({
    providers: [loggerFactory],
    exports: [loggerFactory]
})
export class LoggerModule {}

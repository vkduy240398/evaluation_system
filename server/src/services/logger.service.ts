import { LoggerService } from '@nestjs/common';
import { Logger } from 'log4js';

// @Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  // eslint-disable-next-line no-empty-function
  constructor(private readonly logger: Logger) {}

  log(req: any, content: string) {
    if (!req) {
      this.logger.info(`${content}`);
    } else if (
      req.originalUrl === '/api/v1/auth/login' ||
      (req?.user && req?.user?.id)
    ) {
      this.logger.info(
        `[${req.header('x-forwarded-for') || req.ip.split(':').pop()}] [${
          req?.user && req?.user?.id ? req?.user?.id : ''
        }] ${req.method}: ${req.originalUrl}${
          req.body && Object.keys(req.body).length !== 0
            ? ' - ' + JSON.stringify(req.body)
            : ''
        } - ${content}`,
      );
    }
  }
  error(req: any, content: string) {
    if (!req) {
      this.logger.error(`${content}`);
    } else if (
      req.originalUrl === '/api/v1/auth/login' ||
      (req?.user && req?.user?.id)
    ) {
      this.logger.error(
        `[${req.header('x-forwarded-for') || req.ip.split(':').pop()}] [${
          req?.user && req?.user?.id ? req?.user?.id : ''
        }] ${req.method}: ${req.originalUrl}${
          req.body && Object.keys(req.body).length !== 0
            ? ' - ' + JSON.stringify(req.body)
            : ''
        } - ${content}`,
      );
    }
  }
  warn(req: any, content: string) {
    if (!req) {
      this.logger.warn(`${content}`);
    } else if (
      req.originalUrl === '/api/v1/auth/login' ||
      (req?.user && req?.user?.id)
    ) {
      this.logger.warn(
        `[${req.header('x-forwarded-for') || req.ip.split(':').pop()}] [${
          req?.user && req?.user?.id ? req?.user?.id : ''
        }] ${req.method}: ${req.originalUrl}${
          req.body && Object.keys(req.body).length !== 0
            ? ' - ' + JSON.stringify(req.body)
            : ''
        } - ${content}`,
      );
    }
  }
  debug?(req: any, content: string) {
    if (!req) {
      this.logger.debug(`${content}`);
    } else if (
      req.originalUrl === '/api/v1/auth/login' ||
      (req?.user && req?.user?.id)
    ) {
      this.logger.debug(
        `[${req.header('x-forwarded-for') || req.ip.split(':').pop()}] [${
          req?.user && req?.user?.id ? req?.user?.id : ''
        }] ${req.method}: ${req.originalUrl}${
          req.body && Object.keys(req.body).length !== 0
            ? ' - ' + JSON.stringify(req.body)
            : ''
        } - ${content}`,
      );
    }
  }
}

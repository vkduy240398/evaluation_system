import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLogger } from 'src/services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private logger: CustomLogger,
  ) {
    //
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(request, response.statusCode);
        console.log(`Time executed... ${Date.now() - now}ms`);
      }),
    );
  }
}

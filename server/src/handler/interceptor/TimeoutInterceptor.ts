import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ErrorMessage } from 'src/constant/ErrorMessage';
import { RuntimeException } from 'src/model/exception/RuntimeException';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // Define timeout limit
      timeout(Number(process.env.SERVER_TIMEOUT) || 300000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RuntimeException(
                ErrorMessage.IDM_TIMEOUT_ERROR,
                HttpStatus.REQUEST_TIMEOUT,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}

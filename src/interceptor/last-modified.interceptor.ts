import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LastModifiedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const httpResponse = context.switchToHttp().getResponse();
        if (data && data.updated_at) {
          httpResponse.setHeader('Last-Modified', new Date(data.updated_at).toUTCString());
        }
        return data;
      }),
    );
  }
}

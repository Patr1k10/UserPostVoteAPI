import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class HideFieldsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        let transformedData = data;
        // Если это массив пользователей в поле 'users'
        if (data && data.users && Array.isArray(data.users)) {
          data.users = data.users.map((item) => this.transformObject(item));
        }
        // Если это отдельный пользователь
        else if (data && data.username) {
          transformedData = this.transformObject(data);
        }
        return transformedData;
      }),
    );
  }

  private transformObject(obj: any): any {
    const newObj = { ...obj };
    delete newObj.password;
    delete newObj.created_at;
    delete newObj.updated_at;
    delete newObj.deleted_at;
    return newObj;
  }
}

import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> {
        const request: Request = context.switchToHttp().getRequest();
        const { ip, method, originalUrl } = request;
        const userAgent = request.headers['user-agent'] || '';

        return;
    }
}

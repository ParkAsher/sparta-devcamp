import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { CustomException, ErrorDomain } from './customException';
import { Request, Response } from 'express';

export interface ApiError {
    domain: ErrorDomain;
    message: string;
    timestamp: Date;
}

@Catch(Error) // Catch 데코레이터는 처리되지 않은 모든 예외를 잡으려고 할 때 사용
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>();
        const res = ctx.getResponse<Response>();

        let body: ApiError;
        let status: HttpStatus;

        if (exception instanceof CustomException) {
            status = exception.status;
            body = {
                domain: exception.domain,
                message: exception.message,
                timestamp: exception.timestamp,
            };
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            body = new CustomException(
                'generic',
                exception.message,
                exception.message,
                exception.getStatus(),
            );
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            body = new CustomException(
                'generic',
                `Internal server error: ${exception.message}`,
                'Internal server eror',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        console.log(exception);

        res.status(status).json(body);
    }
}

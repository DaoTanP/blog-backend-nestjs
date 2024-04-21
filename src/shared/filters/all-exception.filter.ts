import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { Messages } from '@/shared/constants/messages.enum';
import { STATUS_CODES } from 'http';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const httpArgumentsHost: HttpArgumentsHost = host.switchToHttp();
    const response: Response = httpArgumentsHost.getResponse<Response>();
    const request: Request = httpArgumentsHost.getRequest<Request>();
    const status: number = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception.cause || exception.name || STATUS_CODES[status],
      message:
        exception.message ||
        exception.getResponse()['message'] ||
        Messages.INTERNAL_SERVER_ERROR ||
        'Internal Server Error',
    });
  }
}

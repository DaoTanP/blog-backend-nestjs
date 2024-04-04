import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { Messages } from '@shared/constants/messages.constant';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
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
      message:
        exception.message ||
        exception.getResponse()['message'] ||
        Messages.INTERNAL_SERVER_ERROR ||
        'Internal Server Error',
    });
  }
}

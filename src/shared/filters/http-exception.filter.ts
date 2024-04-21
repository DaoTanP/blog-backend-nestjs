import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { Messages } from '@/shared/constants/messages.enum';
import { STATUS_CODES } from 'http';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const httpArgumentsHost: HttpArgumentsHost = host.switchToHttp();
    const response: Response = httpArgumentsHost.getResponse<Response>();
    const request: Request = httpArgumentsHost.getRequest<Request>();
    const status: number = exception.getStatus();

    response.status(status).json({
      statusCode: exception.getResponse()['statusCode'] || status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error:
        exception.getResponse()['error'] ||
        exception.cause ||
        exception.name ||
        STATUS_CODES[status],
      message:
        exception.getResponse()['message'] ||
        exception.message ||
        Messages.INTERNAL_SERVER_ERROR ||
        'Internal Server Error',
    });
  }
}

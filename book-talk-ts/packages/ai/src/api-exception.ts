import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { type ApiResult, toErrorResult } from './api-result';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { status, result } = this.handleException(exception, request);

    response.status(status).json(result);
  }

  private handleException(
    exception: unknown,
    request: { method: string; url: string },
  ): { status: number; result: ApiResult<null> } {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, request);
    }

    return this.handleInternalServerError(exception, request);
  }

  private handleHttpException(
    exception: HttpException,
    request: { method: string; url: string },
  ): { status: number; result: ApiResult<null> } {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as { message?: string }).message ??
          exception.message;

    this.logger.warn(
      `[${request.method}] ${request.url} - ${status}: ${message}`,
    );

    return {
      status,
      result: toErrorResult(message, `HTTP_${status}`),
    };
  }

  private handleInternalServerError(
    exception: unknown,
    request: { method: string; url: string },
  ): { status: number; result: ApiResult<null> } {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error ? exception.message : 'Internal Server Error';

    this.logger.error(
      `[${request.method}] ${request.url} - ${status}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    return {
      status,
      result: toErrorResult('Internal Server Error', 'INTERNAL_SERVER_ERROR'),
    };
  }
}

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
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { status, result } = this.handleException(exception, request);

    response.status(status).json(result);
  }

  private handleException(
    exception: unknown,
    request: { method: string; url: string }
  ): { status: number; result: ApiResult<null> } {
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, request);
    }

    return this.handleInternalServerError(exception, request);
  }

  /** HttpException 예외 처리 */
  private handleHttpException(
    exception: HttpException,
    request: { method: string; url: string }
  ): { status: number; result: ApiResult<null> } {
    const status = exception.getStatus();
    const message = exception.message;

    Logger.warn(`[${request.method}] ${request.url} - ${status}: ${message}`);

    return {
      status,
      result: toErrorResult(message, `HTTP_${status}`),
    };
  }

  /** Internal Server Error 예외 처리 */
  private handleInternalServerError(
    exception: unknown,
    request: { method: string; url: string }
  ): { status: number; result: ApiResult<null> } {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof Error ? exception.message : 'Internal Server Error';

    Logger.error(
      `[${request.method}] ${request.url} - ${status}: ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    return {
      status,
      result: toErrorResult('Internal Server Error', 'INTERNAL_SERVER_ERROR'),
    };
  }
}

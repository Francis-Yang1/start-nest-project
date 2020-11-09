import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiResponse } from '../dto/api.response';

@Catch()
export class InternalExceptionFilter implements ExceptionFilter<any> {
  constructor(private logger: Logger) {}

  catch(exception: any, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    this.logger.error(exception);

    const message = exception.response?.message
      ? exception.response.message
      : exception.message;

    response
      .status(200)
      .json(
        ApiResponse.error(500, (message || '').toString()).setPath(
          request.path,
        ),
      );
  }
}

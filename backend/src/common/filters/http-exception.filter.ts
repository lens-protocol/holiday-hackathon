import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const statusCode = exception.getStatus();

    let exceptionMessage: string | any = exception.getResponse();
    if (typeof exceptionMessage === 'object' && exceptionMessage.message) {
      if (Array.isArray(exceptionMessage.message)) {
        exceptionMessage = exceptionMessage.message[0];
      } else {
        exceptionMessage = exceptionMessage.message;
      }
    }
    return response.status(statusCode).send({
      error: {
        message: exceptionMessage,
      },
    });
  }
}

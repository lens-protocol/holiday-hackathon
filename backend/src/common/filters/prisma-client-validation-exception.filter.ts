import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma?.PrismaClientValidationError)
export class PrismaClientValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // TODO: Only send when in debug
    return response.status(HttpStatus.BAD_REQUEST).send({
      error: {
        message: exception.message,
      },
    });
  }
}

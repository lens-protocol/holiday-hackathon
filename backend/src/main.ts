import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { HttpExceptionsFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import fastyfyMultipart from '@fastify/multipart';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    rawBody: true,
  });
  // Get Config
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  // App Registrations
  app.register(fastyfyMultipart);

  // App Middlewares
  app.enableCors();
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new CustomValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter), new HttpExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Influencer  - API')
    .setDescription('Influencer - API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, '0.0.0.0');
  const logger = new Logger();
  logger.log(`Nest Application is running at ${await app.getUrl()}`, 'NestApplication');
}
bootstrap();

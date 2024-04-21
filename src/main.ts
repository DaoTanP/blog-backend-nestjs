import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '@shared/config/swagger.config';
import { HttpExceptionFilter } from '@shared/filters/http-exception.filter';
import { AllExceptionFilter } from '@shared/filters/all-exception.filter';

async function bootstrap(): Promise<void> {
  const app: INestApplication<any> = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerDocument: OpenAPIObject = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );
  SwaggerModule.setup('api-docs', app, swaggerDocument);

  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();

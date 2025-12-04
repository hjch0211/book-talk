import { NestFactory } from '@nestjs/core';
import { GlobalExceptionFilter } from './api-exception';
import { AppModule } from './app.module';

export const booktalkApplication = NestFactory.create(AppModule).then((app) => {
  app.useGlobalFilters(new GlobalExceptionFilter());
  return app;
});

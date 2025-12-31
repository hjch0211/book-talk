import { NestFactory } from '@nestjs/core';
import { GlobalExceptionFilter } from '@src/api-exception.js';
import { AppModule } from '@src/app.module.js';

await NestFactory.create(AppModule).then((app) => {
  app.useGlobalFilters(new GlobalExceptionFilter());
  void app.listen(3001);
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module.js';

await NestFactory.create(AppModule).then((app) => {
  void app.listen(3001);
});

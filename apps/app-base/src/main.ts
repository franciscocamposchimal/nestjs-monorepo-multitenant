import { NestFactory } from '@nestjs/core';
import { AppBaseModule } from './app-base.module';

async function bootstrap() {
  const app = await NestFactory.create(AppBaseModule);
  await app.listen(3000);
}
bootstrap();

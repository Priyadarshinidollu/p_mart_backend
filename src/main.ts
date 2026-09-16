import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors:true,
    instrument: ObserveInstrument,
    rawBody: true,
  });
  
   await app.listen(4000, '0.0.0.0');

  console.log('Server running on http://localhost:4000');
  // await app.listen(process.env.PORT ?? 3000);
  console.log(await app.getUrl())
}
await bootstrap();

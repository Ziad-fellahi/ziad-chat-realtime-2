import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURATION CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, ngrok-skip-browser-warning',
  });

  // 2. ACTIVATION DE REDIS POUR LE CLUSTER
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // 3. PORT ET INTERFACE (Fixé sur 8080 pour le tunnel)
  const port = 8080;
  const host = '127.0.0.1';

  await app.listen(port, host);

  console.log(`🚀 Cluster NestJS + Redis démarré sur : http://${host}:${port}`);
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURATION CORS - TRÈS IMPORTANT
  app.enableCors({
    origin: [
      "http://localhost:3000", // Ton React local
      "https://stage.govo.fr"   // Ton domaine officiel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Si tes routes commencent par /api (vérifie tes appels frontend)
  // app.setGlobalPrefix('api'); 

  // 2. REDIS
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // 3. PORT 8080 (celui que ton Nginx doit viser)
  await app.listen(8080, '127.0.0.1');
  
  console.log(`🚀 Serveur prêt sur le port 8080`);
}
bootstrap();
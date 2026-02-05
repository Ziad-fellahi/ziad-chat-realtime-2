import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // SERVIR LES ASSETS STATIQUES (favicon, images, etc.) depuis frontend/public
  // Chemin relatif attendu depuis le dossier dist du backend après build
  const staticPath = join(__dirname, '..', '..', 'frontend', 'public');
  app.useStaticAssets(staticPath, { prefix: '/' });

  // CONFIGURATION CORS STRICTE
  app.enableCors({
    origin: [
      "http://localhost:5173",
      "https://govostage.vercel.app",
      "https://stage.govo.fr",
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Length', 'X-JSON-Response'],
    maxAge: 3600,
  });

  // Optionnel : app.setGlobalPrefix('api'); // À activer si tu veux /api/chat/...

  // ADAPTATEUR REDIS (Pour le cluster PM2)
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Écoute sur le port 8080 (visé par Nginx)
  await app.listen(8080, '0.0.0.0'); 
  console.log(`🚀 Serveur Backend Cluster sur le port 8080`);
}
bootstrap();
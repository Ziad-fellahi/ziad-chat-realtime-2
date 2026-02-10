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

  // CONFIGURATION CORS
  app.enableCors({
    origin: [
      'http://localhost:4000',         // Frontend React en développement
      'http://localhost:3000',         // Alternative
      'http://127.0.0.1:4000',
      'https://stage.govo.fr',         // Backend hébergé
      'https://govostage.vercel.app/', // Frontend hébergé sur Vercel
      /^https:\/\/.*\.vercel\.app$/,   // Tous les domaines Vercel
      /^https:\/\/ziad-chat-realtime-2.*\.vercel\.app$/, // Votre projet Vercel spécifique
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Optionnel : app.setGlobalPrefix('api'); // À activer si tu veux /api/chat/...

  // ADAPTATEUR REDIS (Pour le cluster PM2)
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Port configuré via variable d'environnement ou 5000 par défaut (visé par Nginx)
  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0'); 
  console.log(`🚀 Serveur Backend Cluster sur le port ${port}`);
  console.log(`📡 CORS activé pour Vercel et localhost`);
  console.log(`🌐 Environnement: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
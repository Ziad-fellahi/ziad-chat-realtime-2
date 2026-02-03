import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Création de l'application NestJS
  const app = await NestFactory.create(AppModule);
  
  // 1. CONFIGURATION CORS
  // On autorise tout pour le test, credentials inclus pour Socket.io
  app.enableCors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Content-Type, Accept, Authorization, ngrok-skip-browser-warning', // Ajoute ngrok-skip-browser-warning ici
});

  // 2. PORT ET INTERFACE
  // On force le port 8080 et l'écoute sur 127.0.0.1 (IP locale)
  // C'est l'adresse exacte que le tunnel Cloudflare va chercher
  const port = process.env.PORT || 5000;
  const host = '127.0.0.1'; 

  await app.listen(port, host);
  
  console.log(`🚀 Serveur NestJS démarré sur : http://${host}:${port}`);
}
bootstrap();
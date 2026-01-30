import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Autorise ton frontend Vercel à communiquer avec ce serveur
  app.enableCors({
    origin: "*", 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // On récupère le port de Render (ou 5000 par défaut)
  const port = process.env.PORT || 5000;

  // IMPORTANT : Une seule ligne listen avec le port ET l'adresse '0.0.0.0'
  await app.listen(port, '0.0.0.0'); 
  
  console.log(`🚀 Serveur lancé sur le port : ${port}`);
}
bootstrap();
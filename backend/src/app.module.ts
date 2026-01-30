import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // On utilise process.env pour récupérer le lien caché sur Render
    MongooseModule.forRoot(process.env.MONGODB_URI!), 
    ChatModule,
  ],
})
export class AppModule {}
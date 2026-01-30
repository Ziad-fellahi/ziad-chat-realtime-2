import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // Ici, on remplace l'adresse '127.0.0.1' par la variable Render
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ChatModule,
  ],
})
export class AppModule {}
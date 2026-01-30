import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Correction de la faute de frappe ici
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ChatModule,
    AuthModule,
  ],
})
export class AppModule {}
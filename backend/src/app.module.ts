import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://localhost:27017/chatdb?authSource=admin',),
    ChatModule,
    AuthModule,
  ],
})
export class AppModule {}

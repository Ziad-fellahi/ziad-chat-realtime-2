import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    default: 'user',
    enum: ['user', 'admin', 'moniteur', 'secretaire'],
  })
  role: string; // 'user' | 'admin' | 'moniteur' | 'secretaire'
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

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
    default: 'eleve',
    enum: ['eleve', 'admin', 'moniteur', 'secretaire'],
  })
  role: string; // 'eleve' | 'admin' | 'moniteur' | 'secretaire'
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

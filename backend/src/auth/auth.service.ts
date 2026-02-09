import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string, role: string = 'user') {
    const allowedRoles = ['user', 'admin', 'moniteur', 'secretaire'];
    const resolvedRole = allowedRoles.includes(role) ? role : 'user';
    const existing = await this.userModel.findOne({ username });
    if (existing) throw new UnauthorizedException('User already exists');
    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({ username, password: hashed, role: resolvedRole });
    await user.save();
    return { username: user.username, role: user.role };
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user._id, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.username,
      role: user.role,
    };
  }

  async getAllUsers() {
    return this.userModel.find({}, { password: 0 }).exec();
  }
}

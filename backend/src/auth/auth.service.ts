import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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

  async register(username: string, password: string, role: string = 'eleve', requestingUser?: any) {
    // Nettoyage des espaces vides
    const cleanUsername = username?.trim();
    const cleanPassword = password?.trim();

    if (!cleanUsername || !cleanPassword) {
      throw new BadRequestException('Username and password are required');
    }

    const allowedRoles = ['eleve', 'admin', 'moniteur', 'secretaire'];
    let resolvedRole = allowedRoles.includes(role) ? role : 'eleve';

    // Validation des permissions selon le rôle du demandeur
    if (requestingUser) {
      if (requestingUser.role === 'moniteur') {
        // Les moniteurs ne peuvent créer que des moniteurs
        if (resolvedRole !== 'moniteur') {
          throw new BadRequestException('Les moniteurs ne peuvent créer que des comptes moniteurs');
        }
      } else if (requestingUser.role === 'secretaire') {
        // Les secrétaires ne peuvent créer que des secrétaires
        if (resolvedRole !== 'secretaire') {
          throw new BadRequestException('Les secrétaires ne peuvent créer que des comptes secrétaires');
        }
      } else if (requestingUser.role === 'eleve') {
        // Les élèves ne peuvent créer que des élèves
        if (resolvedRole !== 'eleve') {
          throw new BadRequestException('Les élèves ne peuvent créer que des comptes élèves');
        }
      }
      // Les admins peuvent tout créer (pas de restriction)
    }

    const existing = await this.userModel.findOne({ username: cleanUsername });
    if (existing) throw new BadRequestException('User already exists');
    const hashed = await bcrypt.hash(cleanPassword, 10);
    const user = new this.userModel({ username: cleanUsername, password: hashed, role: resolvedRole });
    await user.save();
    
    // Générer un JWT pour le compte nouvellement créé
    const payload = { sub: user._id, username: user.username, role: user.role };
    const access_token = this.jwtService.sign(payload);
    
    return { 
      username: user.username, 
      role: user.role,
      access_token
    };
  }

  async login(username: string, password: string) {
    // Nettoyage des espaces vides
    const cleanUsername = username?.trim();
    const cleanPassword = password?.trim();

    if (!cleanUsername || !cleanPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userModel.findOne({ username: cleanUsername });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(cleanPassword, user.password);
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

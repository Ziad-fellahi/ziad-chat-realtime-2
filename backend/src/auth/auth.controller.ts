import { Controller, Post, Body, Get, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string; role?: string }, @Req() req: any) {
    try {
      // Si l'utilisateur est authentifié, on récupère ses infos pour les permissions
      const requestingUser = req.user || null;
      return this.authService.register(body.username, body.password, body.role || 'eleve', requestingUser);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      return this.authService.login(body.username, body.password);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    try {
      const users = await this.authService.getAllUsers();
      return users.map(u => ({
        _id: u._id,
        username: u.username,
        role: u.role,
      }));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

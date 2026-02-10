import { Controller, Post, Body, Get, HttpException, HttpStatus, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async register(@Body() body: { username: string; password: string; role?: string }, @Req() req: any) {
    try {
      const requestingUser = req.user;
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

import { Controller, Post, Body, UseGuards, Request, Get } from "@nestjs/common"
import type { AuthService } from "./auth.service"
import type { CreateUserDto } from "../users/dto/create-user.dto"
import { LocalAuthGuard } from "./guards/local-auth.guard"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import type { LoginDto } from "./dto/login.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}

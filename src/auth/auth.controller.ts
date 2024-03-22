import {
  Controller,
  UsePipes,
  ValidationPipe,
  Body,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ReturnLoginDto } from './dto/return-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async login(@Body() loginDto: LoginDto): Promise<ReturnLoginDto> {
    return await this.authService.login(loginDto);
  }
}

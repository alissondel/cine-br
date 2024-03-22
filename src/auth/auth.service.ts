import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ReturnLoginDto } from './dto/return-login.dto';
import { UsersEntity } from 'src/users/entities/user.entity';
import { validatePassword } from 'src/utils/encrypt/password';
import { NotFoundError } from 'src/commom/errors/types/NotFoundError';
import { LoginPayload } from './dto/login-payload.dto';
import { ReturnUserDto } from 'src/users/dto/return-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const user: UsersEntity | undefined = await this.userService
      .findEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await validatePassword(
      loginDto.password,
      user?.password || '',
    );

    if (!user || !isMatch) {
      throw new NotFoundError('Email or password invalid');
    }

    return {
      accessToken: this.jwtService.sign({
        ...new LoginPayload(user),
      }),
      user: new ReturnUserDto(user),
    };
  }
}

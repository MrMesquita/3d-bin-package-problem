import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/models/user.model';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService
      .findByUsername(username)
      .then((u) => u ?? null);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(login: LoginDto) {
    const user = await this.validateUser(login.username, login.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      username: user.username,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService
      .findByUsername(registerDto.username)
      .then((u) => u ?? null);

    if (existingUser) {
      throw new ConflictException('Username already taken');
    }

    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const newUser = await this.usersService.create({
        username: registerDto.username,
        password: hashedPassword,
      });

      return {
        id: newUser.id,
        username: newUser.username,
      };
    } catch {
      throw new BadRequestException('Failed to create user');
    }
  }
}

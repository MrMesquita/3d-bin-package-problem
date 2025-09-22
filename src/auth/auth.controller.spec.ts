import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockLoginResponse = {
    access_token: 'jwt-token',
    user: {
      id: 1,
      username: 'testuser',
    },
  };

  const mockRegisterResponse = {
    id: 1,
    username: 'testuser',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'testuser',
      password: 'password',
    };

    it('should return access token and user data on successful login', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      authService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should handle service errors', async () => {
      authService.login.mockRejectedValue(new Error('Service error'));

      await expect(controller.login(loginDto)).rejects.toThrow('Service error');
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      username: 'newuser',
      password: 'password123',
    };

    it('should return user data on successful registration', async () => {
      authService.register.mockResolvedValue(mockRegisterResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockRegisterResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw ConflictException when username already exists', async () => {
      authService.register.mockRejectedValue(
        new ConflictException('Username already taken'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw BadRequestException when user creation fails', async () => {
      authService.register.mockRejectedValue(
        new BadRequestException('Failed to create user'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should handle service errors', async () => {
      authService.register.mockRejectedValue(new Error('Service error'));

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Service error',
      );
    });
  });
});

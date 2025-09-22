import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password: 'hashedPassword',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      usersService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password');

      expect(result).toEqual(mockUser);
      expect(usersService.findByUsername).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    });

    it('should return null when user is not found', async () => {
      usersService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password');

      expect(result).toBeNull();
      expect(usersService.findByUsername).toHaveBeenCalledWith('nonexistent');
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null when password is invalid', async () => {
      usersService.findByUsername.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword',
      );
    });
  });

  describe('login', () => {
    const loginDto = { username: 'testuser', password: 'password' };

    it('should return access token and user data when credentials are valid', async () => {
      const expectedToken = 'jwt-token';
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: expectedToken,
        user: {
          id: mockUser.id,
          username: mockUser.username,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });

  describe('register', () => {
    const registerDto = { username: 'newuser', password: 'password123' };

    it('should create and return new user when username is available', async () => {
      const hashedPassword = 'hashedPassword123';
      const newUser = {
        ...mockUser,
        id: 2,
        username: 'newuser',
        password: hashedPassword,
      };

      usersService.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      usersService.create.mockResolvedValue(newUser);

      const result = await service.register(registerDto);

      expect(result).toEqual({
        id: newUser.id,
        username: newUser.username,
      });
      expect(usersService.findByUsername).toHaveBeenCalledWith('newuser');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        username: 'newuser',
        password: hashedPassword,
      });
    });

    it('should throw ConflictException when username already exists', async () => {
      usersService.findByUsername.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('Username already taken'),
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user creation fails', async () => {
      usersService.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      usersService.create.mockRejectedValue(new Error('Database error'));

      await expect(service.register(registerDto)).rejects.toThrow(
        new BadRequestException('Failed to create user'),
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user object with userId and username', () => {
      const payload: JwtPayload = {
        username: 'testuser',
        sub: 1,
      };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 1,
        username: 'testuser',
      });
    });

    it('should extract userId from sub property', () => {
      const payload: JwtPayload = {
        username: 'anotheruser',
        sub: 42,
      };

      const result = strategy.validate(payload);

      expect(result.userId).toBe(42);
      expect(result.username).toBe('anotheruser');
    });

    it('should handle different usernames correctly', () => {
      const testCases = [
        { username: 'admin', sub: 1 },
        { username: 'user123', sub: 2 },
        { username: 'test_user', sub: 999 },
      ];

      testCases.forEach((payload) => {
        const result = strategy.validate(payload);
        expect(result).toEqual({
          userId: payload.sub,
          username: payload.username,
        });
      });
    });

    it('should preserve exact username format', () => {
      const payload: JwtPayload = {
        username: 'User.With-Special_Characters123',
        sub: 100,
      };

      const result = strategy.validate(payload);

      expect(result.username).toBe('User.With-Special_Characters123');
    });
  });
});
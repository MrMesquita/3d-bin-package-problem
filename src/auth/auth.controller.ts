import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description:
      'Autentica um usuário existente e retorna um token JWT para acesso aos endpoints protegidos',
  })
  @ApiBody({
    type: LoginDto,
    description: 'Credenciais de login do usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'Token JWT para autenticação',
          example:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwic3ViIjoxLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTYzNDU2Nzg5MH0...',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
              description: 'ID único do usuário',
              example: 1,
            },
            username: {
              type: 'string',
              description: 'Nome de usuário',
              example: 'testuser',
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['username should not be empty', 'password should not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description:
      'Cria uma nova conta de usuário no sistema com senha criptografada',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'Dados para criação de nova conta',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'ID único do usuário criado',
          example: 1,
        },
        username: {
          type: 'string',
          description: 'Nome de usuário criado',
          example: 'testuser',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Nome de usuário já existe',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Username already taken' },
        error: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Dados de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['password must be longer than or equal to 6 characters'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}

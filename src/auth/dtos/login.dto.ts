import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário único para autenticação',
    example: 'testuser',
    minLength: 1,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Senha do usuário para autenticação',
    example: '123456',
    minLength: 1,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

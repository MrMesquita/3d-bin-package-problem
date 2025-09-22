import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DimensionsDto {
  @ApiProperty({
    description: 'Altura do produto em centímetros',
    example: 5,
    minimum: 0.1,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  altura: number;

  @ApiProperty({
    description: 'Largura do produto em centímetros',
    example: 10,
    minimum: 0.1,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  largura: number;

  @ApiProperty({
    description: 'Comprimento do produto em centímetros',
    example: 3,
    minimum: 0.1,
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  comprimento: number;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'ID único do produto',
    example: 'PROD001',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  produto_id: string;

  @ApiProperty({
    description: 'Dimensões do produto (altura, largura, comprimento)',
    type: DimensionsDto,
    example: {
      altura: 5,
      largura: 10,
      comprimento: 3,
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensoes: DimensionsDto;
}

import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class DimensionsDto {
  @IsNumber()
  @IsPositive()
  altura: number;

  @IsNumber()
  @IsPositive()
  largura: number;

  @IsNumber()
  @IsPositive()
  comprimento: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  produto_id: string;

  @IsNotEmpty()
  dimensoes: DimensionsDto;
}

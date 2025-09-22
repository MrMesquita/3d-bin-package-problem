import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class DimensionsDto {
  @IsNumber()
  @IsPositive()
  height: number;

  @IsNumber()
  @IsPositive()
  width: number;

  @IsNumber()
  @IsPositive()
  length: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  dimensions: DimensionsDto;
}

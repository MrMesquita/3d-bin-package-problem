import { Type } from 'class-transformer/types/decorators/type.decorator';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensoes: DimensionsDto;
}

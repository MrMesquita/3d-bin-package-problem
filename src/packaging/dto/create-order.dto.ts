import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  pedido_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  produtos: CreateProductDto[];
}

export class RequestOptimizeOrdersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDto)
  pedidos: CreateOrderDto[];
}

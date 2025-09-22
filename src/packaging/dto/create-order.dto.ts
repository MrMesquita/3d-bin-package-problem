import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID único do pedido',
    example: 12345,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  pedido_id: number;

  @ApiProperty({
    description: 'Lista de produtos contidos no pedido',
    type: [CreateProductDto],
    example: [
      {
        produto_id: 1,
        quantidade: 2,
        largura: 10,
        altura: 5,
        profundidade: 3,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  produtos: CreateProductDto[];
}

export class RequestOptimizeOrdersDto {
  @ApiProperty({
    description: 'Lista de pedidos para otimização de embalagem',
    type: [CreateOrderDto],
    example: [
      {
        pedido_id: 12345,
        produtos: [
          {
            produto_id: 1,
            quantidade: 2,
            largura: 10,
            altura: 5,
            profundidade: 3,
          },
          {
            produto_id: 2,
            quantidade: 1,
            largura: 8,
            altura: 4,
            profundidade: 2,
          },
        ],
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDto)
  pedidos: CreateOrderDto[];
}

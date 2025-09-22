import { CreateProductDto } from './create-product.dto';

export class PackedBoxDto {
  name: string;
  dimensions: {
    height: number;
    width: number;
    length: number;
  };
  products: CreateProductDto[];
}

export class PackedOrderDto {
  orderId: string;
  boxes: PackedBoxDto[];
}

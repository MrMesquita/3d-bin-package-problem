import { CreateProductDto } from '../dto/create-product.dto';

export interface InternalBox {
  name: string | null;
  dimensions?: { height: number; width: number; length: number };
  products: CreateProductDto[];
  observations?: string;
}
